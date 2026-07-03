import { supabase } from './supabase';
import { Post, PostComment, Follow } from '../app/types';
import { toCamelCase, toSnakeCase } from './api';

// ----------------------------------------------------
// STORAGE BUCKETS
// ----------------------------------------------------

export async function uploadPostMedia(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('post-media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('post-media')
    .getPublicUrl(filePath);

  return publicUrl;
}

// ----------------------------------------------------
// COMMUNITY FEED API
// ----------------------------------------------------

export async function fetchCommunityFeed(currentUserId?: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey(*),
      company:companies!posts_company_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  let feed = toCamelCase(data) as Post[];

  if (currentUserId && feed.length > 0) {
    const postIds = feed.map(p => p.id);

    const [likesRes, savesRes, followsRes] = await Promise.all([
      supabase.from('post_likes').select('post_id').eq('user_id', currentUserId).in('post_id', postIds),
      supabase.from('saved_posts').select('post_id').eq('user_id', currentUserId).in('post_id', postIds),
      supabase.from('follows').select('*').eq('follower_id', currentUserId)
    ]);

    const likedPostIds = new Set((likesRes.data || []).map(l => l.post_id));
    const savedPostIds = new Set((savesRes.data || []).map(s => s.post_id));
    
    const followedUserIds = new Set((followsRes.data || []).filter(f => f.following_user_id).map(f => f.following_user_id));
    const followedCompanyIds = new Set((followsRes.data || []).filter(f => f.following_company_id).map(f => f.following_company_id));

    feed = feed.map(post => {
      const isFollowing = post.userId 
        ? followedUserIds.has(post.userId) 
        : post.companyId 
          ? followedCompanyIds.has(post.companyId) 
          : false;

      return {
        ...post,
        hasLiked: likedPostIds.has(post.id),
        hasSaved: savedPostIds.has(post.id),
        isFollowingAuthor: isFollowing
      };
    });
  }

  return feed;
}

export async function createCommunityPost(post: Partial<Post>): Promise<Post> {
  const payload = toSnakeCase(post);
  const { data, error } = await supabase
    .from('posts')
    .insert(payload)
    .select(`
      *,
      user:users!posts_user_id_fkey(*),
      company:companies!posts_company_id_fkey(*)
    `)
    .single();

  if (error) throw error;
  return toCamelCase(data) as Post;
}

export async function togglePostLike(postId: string, userId: string, hasLiked: boolean): Promise<number> {
  if (hasLiked) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }

  const likesIncrement = hasLiked ? -1 : 1;
  const { data, error: updateError } = await supabase.rpc('adjust_post_likes', { 
    post_id_param: postId, 
    increment_val: likesIncrement 
  });
  
  if (updateError) {
    const { data: postData } = await supabase.from('posts').select('likes_count').eq('id', postId).single();
    const currentLikes = postData?.likes_count || 0;
    const newLikes = Math.max(0, currentLikes + likesIncrement);
    await supabase.from('posts').update({ likes_count: newLikes }).eq('id', postId);
    return newLikes;
  }

  return data;
}

export async function togglePostSave(postId: string, userId: string, hasSaved: boolean): Promise<boolean> {
  if (hasSaved) {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('saved_posts')
      .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
    return true;
  }
}

// ----------------------------------------------------
// FOLLOW SYSTEM API
// ----------------------------------------------------

export async function followAuthor(followerId: string, targetId: string, isCompany: boolean): Promise<void> {
  const followRow: Record<string, string> = { follower_id: followerId };
  if (isCompany) {
    followRow.following_company_id = targetId;
  } else {
    followRow.following_user_id = targetId;
  }

  const { error } = await supabase.from('follows').insert(followRow);
  if (error) throw error;
}

export async function unfollowAuthor(followerId: string, targetId: string, isCompany: boolean): Promise<void> {
  let query = supabase.from('follows').delete().eq('follower_id', followerId);
  if (isCompany) {
    query = query.eq('following_company_id', targetId);
  } else {
    query = query.eq('following_user_id', targetId);
  }

  const { error } = await query;
  if (error) throw error;
}

// ----------------------------------------------------
// THREADED COMMENTS API
// ----------------------------------------------------

export async function fetchPostComments(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      user:users!post_comments_user_id_fkey(*),
      company:companies!post_comments_company_id_fkey(*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  const rawComments = toCamelCase(data) as PostComment[];
  
  const commentMap = new Map<string, PostComment>();
  const topLevelComments: PostComment[] = [];

  rawComments.forEach(comment => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  rawComments.forEach(comment => {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId);
      parent?.replies?.push(comment);
    } else {
      topLevelComments.push(comment);
    }
  });

  return topLevelComments;
}

export async function createPostComment(comment: Partial<PostComment>): Promise<PostComment> {
  const payload = toSnakeCase(comment);
  const { data, error } = await supabase
    .from('post_comments')
    .insert(payload)
    .select(`
      *,
      user:users!post_comments_user_id_fkey(*),
      company:companies!post_comments_company_id_fkey(*)
    `)
    .single();

  if (error) throw error;

  supabase.rpc('increment_post_comments', { post_id_param: comment.postId }).catch(() => {
    supabase.from('posts').select('comments_count').eq('id', comment.postId!).single().then(({ data: postData }) => {
      const currentComments = postData?.comments_count || 0;
      supabase.from('posts').update({ comments_count: currentComments + 1 }).eq('id', comment.postId!);
    });
  });

  return toCamelCase(data) as PostComment;
}
