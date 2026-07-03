import { useState, useEffect } from 'react';
import { 
  Newspaper, 
  PlusCircle, 
  TrendingUp, 
  UserCheck, 
  Briefcase, 
  ChevronRight,
  MessageSquare,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useFeedStore } from '../stores/feedStore';
import { useDataStore } from '../stores/dataStore';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import { CommentSection } from '../components/feed/CommentSection';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { Post } from '../types';
import { useNavigate } from 'react-router';

const FILTER_TAGS = [
  { id: 'all', label: 'All Updates' },
  { id: 'project', label: 'Projects' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'article', label: 'Articles' },
  { id: 'advice', label: 'Advice' },
  { id: 'question', label: 'Questions' },
];

export function FeedPage() {
  const navigate = useNavigate();
  const { userId, userName, profileImage } = useAuthStore();
  const { posts, isLoading, loadFeed, addPost, likePost, savePost, toggleFollowAuthor, incrementCommentsCount } = useFeedStore();
  
  // Data for recommendation widgets
  const { jobAnnouncements } = useDataStore();

  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState<Post | null>(null);

  useEffect(() => {
    loadFeed(userId);
  }, [userId]);

  const handleCreatePost = async (postData: {
    content: string;
    mediaUrls: string[];
    attachmentUrls: string[];
    hashtags: string[];
  }) => {
    await addPost({
      ...postData,
      userId: userId,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleLike = (postId: string) => {
    if (!userId) return;
    likePost(postId, userId);
  };

  const handleSave = (postId: string) => {
    if (!userId) return;
    savePost(postId, userId);
  };

  const handleFollowToggle = (authorId: string, isCompany: boolean) => {
    if (!userId) return;
    toggleFollowAuthor(authorId, isCompany, userId);
  };

  // Filter posts based on type matches or hashtags
  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    
    // Check if post content has hashtags matching filter
    const matchesHashtag = post.hashtags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
    
    // Check if post has keyword in content as a fallback or type matches (would be ideal, but fallback for now)
    const matchesKeyword = post.content.toLowerCase().includes(activeFilter.toLowerCase());
    
    return matchesHashtag || matchesKeyword;
  });

  // Pull a couple of recommended jobs for the feed sidebar
  const recommendedJobs = jobAnnouncements
    .filter(j => j.postStatus === 'approved')
    .slice(0, 2);

  // Mock suggested connections (professional networking sidebar)
  const suggestedConnections = [
    { id: 'c1', name: 'Amine Khelifi', role: 'Senior Android Engineer', initials: 'AK' },
    { id: 'c2', name: 'Sara Bouaziz', role: 'UX Designer at Yassir', initials: 'SB' },
  ];

  return (
    <div className="h-full overflow-y-auto pb-20 bg-background/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-6 rounded-b-[32px] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary-foreground text-xl font-bold tracking-tight">
              Community Feed
            </h1>
            <p className="text-primary-foreground/85 text-xs mt-0.5 font-medium">
              Algiers professional community
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-all active:scale-95"
            title="Create Post"
          >
            <PlusCircle className="w-5.5 h-5.5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Categories Horizontal Filter bar */}
      <div className="px-4 mt-4 overflow-x-auto scrollbar-hide flex gap-2 py-1 select-none">
        {FILTER_TAGS.map((tag) => {
          const isActive = activeFilter === tag.id;
          return (
            <Badge
              key={tag.id}
              onClick={() => setActiveFilter(tag.id)}
              className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors border text-[11px] font-semibold select-none ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted/80'
              }`}
            >
              {tag.label}
            </Badge>
          );
        })}
      </div>

      <div className="px-5 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Feed List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-card border border-border/80 rounded-2xl">
              <span className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <span className="text-xs font-medium">Loading professional feed...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-card border border-border/85 rounded-2xl p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-3">
              <Compass className="w-10 h-10 text-muted-foreground/60" />
              <div>
                <p className="font-semibold text-foreground text-sm">No updates found</p>
                <p className="mt-1">Be the first to share your startup, certificates, or projects!</p>
              </div>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                size="sm" 
                className="rounded-full mt-2"
              >
                Create First Post
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={userId}
                onLike={handleLike}
                onSave={handleSave}
                onFollowToggle={handleFollowToggle}
                onCommentClick={(p) => setSelectedPostForComment(p)}
              />
            ))
          )}
        </div>

        {/* Sidebar widgets (Suggested connections and recommended jobs) */}
        <div className="flex flex-col gap-4">
          {/* Suggested Connections Widget */}
          <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" /> Suggested Connections
            </h3>
            <div className="flex flex-col gap-3">
              {suggestedConnections.map(conn => (
                <div key={conn.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8.5 h-8.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {conn.initials}
                    </div>
                    <div className="max-w-[130px]">
                      <p className="text-xs font-bold text-foreground truncate hover:underline cursor-pointer">
                        {conn.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {conn.role}
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-primary hover:underline px-2.5 py-1 rounded-full bg-primary/5">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs Widget */}
          {recommendedJobs.length > 0 && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-primary" /> Recommended Jobs
              </h3>
              <div className="flex flex-col gap-3">
                {recommendedJobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="group flex items-start gap-2.5 cursor-pointer hover:bg-muted/30 p-1.5 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-border">
                      💼
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-primary">
                        {job.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {job.company} &bull; {job.location}
                      </p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Dialog Modal */}
      {isCreateOpen && (
        <CreatePostModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          userId={userId}
          userName={userName}
          profileImage={profileImage}
          onPostCreated={handleCreatePost}
        />
      )}

      {/* Comment Section Sheet (Slide up drawer) */}
      <Sheet 
        open={!!selectedPostForComment} 
        onOpenChange={(val) => !val && setSelectedPostForComment(null)}
      >
        <SheetContent side="bottom" className="p-0 border-none bg-transparent h-auto max-h-[90vh]">
          {selectedPostForComment && (
            <CommentSection
              postId={selectedPostForComment.id}
              currentUserId={userId}
              currentUserName={userName}
              currentUserImage={profileImage}
              onCommentAdded={() => incrementCommentsCount(selectedPostForComment.id)}
              onClose={() => setSelectedPostForComment(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
