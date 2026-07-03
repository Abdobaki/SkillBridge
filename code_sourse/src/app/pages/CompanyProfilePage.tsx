import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Info,
  Loader2, 
  ArrowLeft,
  Briefcase,
  Newspaper,
  Compass
} from 'lucide-react';
import { Company, JobAnnouncement, Post } from '../types';
import { 
  fetchCompanyDetails, 
  fetchCompanyJobs, 
  fetchCompanyPosts, 
  fetchCompanyMembers,
  CompanyMember
} from '../../lib/company-api';
import { useAuthStore } from '../stores/authStore';
import { useFeedStore } from '../stores/feedStore';
import { CompanyHeader } from '../components/company/CompanyHeader';
import { PostCard } from '../components/feed/PostCard';
import { MobileContainer } from '../components/MobileContainer';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { userId, userName, profileImage } = useAuthStore();
  const { posts: feedPosts, likePost, savePost, toggleFollowAuthor, incrementCommentsCount } = useFeedStore();

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<JobAnnouncement[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'posts' | 'people'>('home');

  useEffect(() => {
    if (!companyId) return;

    async function loadCompanyData() {
      setLoading(true);
      try {
        const [companyData, jobsData, postsData, membersData] = await Promise.all([
          fetchCompanyDetails(companyId!),
          fetchCompanyJobs(companyId!),
          fetchCompanyPosts(companyId!),
          fetchCompanyMembers(companyId!)
        ]);

        setCompany(companyData);
        setJobs(jobsData);
        setPosts(postsData);
        setMembers(membersData);
      } catch (err: any) {
        toast.error('Failed to load company details: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCompanyData();
  }, [companyId]);

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Loading company profile...</span>
        </div>
      </MobileContainer>
    );
  }

  if (!company) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center gap-4">
          <Building2 className="w-12 h-12 text-muted-foreground/50" />
          <p className="font-semibold text-foreground">Company profile not found.</p>
          <Button onClick={() => navigate('/home')} variant="outline" size="sm" className="rounded-full">
            Back to Home
          </Button>
        </div>
      </MobileContainer>
    );
  }

  // Check if current user is manager (Owner, Admin or Recruiter)
  const isManager = members.some(m => m.userId === userId);

  // Check if user is following this company (based on posts follows map or company properties)
  const feedMatches = feedPosts.find(p => p.companyId === company.id);
  const isFollowing = feedMatches ? !!feedMatches.isFollowingAuthor : false;

  const handleFollowToggle = async () => {
    if (!userId) return;
    await toggleFollowAuthor(company.id, true, userId);
  };

  const handleLike = (postId: string) => {
    if (!userId) return;
    likePost(postId, userId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, hasLiked: !p.hasLiked, likesCount: p.likesCount + (p.hasLiked ? -1 : 1) } : p));
  };

  const handleSave = (postId: string) => {
    if (!userId) return;
    savePost(postId, userId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, hasSaved: !p.hasSaved } : p));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-5">
            <h3 className="text-sm font-bold text-foreground mb-2.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" /> About {company.name}
            </h3>
            <p className="text-xs text-foreground/80 whitespace-pre-line leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
              {company.description || 'No description provided.'}
            </p>
          </div>
        );

      case 'jobs':
        return (
          <div className="p-5">
            {jobs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-xs bg-muted/10 border border-border/50 rounded-xl">
                No active job announcements right now.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="p-4 rounded-xl border border-border hover:bg-muted/30 transition-all cursor-pointer flex justify-between items-center bg-card shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground hover:text-primary">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">📍 {job.location}</span>
                        <span>&bull;</span>
                        <span className="text-primary font-medium">{job.salary || 'Salary Undisclosed'}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] rounded-full uppercase">
                      {job.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'posts':
        return (
          <div className="p-5">
            {posts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-xs bg-muted/10 border border-border/50 rounded-xl">
                No recent company updates.
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={userId}
                  onLike={handleLike}
                  onSave={handleSave}
                  onFollowToggle={handleFollowToggle}
                  onCommentClick={() => {}} // Simple fallback or detail navigations
                />
              ))
            )}
          </div>
        );

      case 'people':
        return (
          <div className="p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Our Team Members</h3>
            <div className="flex flex-col gap-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {member.user?.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{member.user?.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.user?.profession}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] capitalize px-2 py-0.5">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-10 bg-background/30">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Header Widget */}
      <CompanyHeader
        company={company}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        isManager={isManager}
        onEditClick={() => navigate(`/company/${company.id}/edit`)}
      />

      {/* Tabs list navigation */}
      <div className="flex border-b border-border bg-card px-4 sticky top-0 z-40">
        {(['home', 'jobs', 'posts', 'people'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-bold capitalize border-b-2 transition-colors focus:outline-none ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic contents */}
      {renderTabContent()}
    </div>
  );
}
