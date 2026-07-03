import { create } from 'zustand';
import { Post, PostComment } from '../types';
import {
  fetchCommunityFeed,
  createCommunityPost,
  togglePostLike,
  togglePostSave,
  followAuthor,
  unfollowAuthor,
} from '../../lib/community-api';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFeed: (currentUserId?: string) => Promise<void>;
  addPost: (postData: Partial<Post>) => Promise<Post>;
  likePost: (postId: string, currentUserId: string) => Promise<void>;
  savePost: (postId: string, currentUserId: string) => Promise<void>;
  toggleFollowAuthor: (
    authorId: string,
    isCompany: boolean,
    currentUserId: string
  ) => Promise<void>;
  incrementCommentsCount: (postId: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  loadFeed: async (currentUserId) => {
    set({ isLoading: true, error: null });
    try {
      const feed = await fetchCommunityFeed(currentUserId);
      set({ posts: feed, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch feed', isLoading: false });
    }
  },

  addPost: async (postData) => {
    try {
      const newPost = await createCommunityPost(postData);
      set((state) => ({ posts: [newPost, ...state.posts] }));
      return newPost;
    } catch (err: any) {
      console.error('Failed to create post:', err);
      throw err;
    }
  },

  likePost: async (postId, currentUserId) => {
    const { posts } = get();
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const hasLiked = !!post.hasLiked;
    const originalLikesCount = post.likesCount || 0;

    // Optimistic Update
    const updatedPost = {
      ...post,
      hasLiked: !hasLiked,
      likesCount: Math.max(0, originalLikesCount + (hasLiked ? -1 : 1)),
    };
    set({
      posts: posts.map((p) => (p.id === postId ? updatedPost : p)),
    });

    try {
      const newLikesCount = await togglePostLike(postId, currentUserId, hasLiked);
      // Ensure backend count is correctly synced
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, likesCount: newLikesCount } : p
        ),
      }));
    } catch (err) {
      console.error('Failed to update like status:', err);
      // Revert in case of failure
      set({
        posts: posts.map((p) => (p.id === postId ? post : p)),
      });
    }
  },

  savePost: async (postId, currentUserId) => {
    const { posts } = get();
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const hasSaved = !!post.hasSaved;

    // Optimistic Update
    const updatedPost = { ...post, hasSaved: !hasSaved };
    set({
      posts: posts.map((p) => (p.id === postId ? updatedPost : p)),
    });

    try {
      const savedStatus = await togglePostSave(postId, currentUserId, hasSaved);
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, hasSaved: savedStatus } : p
        ),
      }));
    } catch (err) {
      console.error('Failed to update save status:', err);
      // Revert in case of failure
      set({
        posts: posts.map((p) => (p.id === postId ? post : p)),
      });
    }
  },

  toggleFollowAuthor: async (authorId, isCompany, currentUserId) => {
    const { posts } = get();
    // Find if the author is currently followed based on posts state
    const postWithAuthor = posts.find((p) =>
      isCompany ? p.companyId === authorId : p.userId === authorId
    );
    if (!postWithAuthor) return;

    const isFollowing = !!postWithAuthor.isFollowingAuthor;

    // Optimistic Update for all posts by the same author
    set((state) => ({
      posts: state.posts.map((p) => {
        const matchesAuthor = isCompany
          ? p.companyId === authorId
          : p.userId === authorId;
        return matchesAuthor ? { ...p, isFollowingAuthor: !isFollowing } : p;
      }),
    }));

    try {
      if (isFollowing) {
        await unfollowAuthor(currentUserId, authorId, isCompany);
      } else {
        await followAuthor(currentUserId, authorId, isCompany);
      }
    } catch (err) {
      console.error('Failed to update follow status:', err);
      // Revert in case of failure
      set((state) => ({
        posts: state.posts.map((p) => {
          const matchesAuthor = isCompany
            ? p.companyId === authorId
            : p.userId === authorId;
          return matchesAuthor ? { ...p, isFollowingAuthor: isFollowing } : p;
        }),
      }));
    }
  },

  incrementCommentsCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
      ),
    }));
  },
}));
