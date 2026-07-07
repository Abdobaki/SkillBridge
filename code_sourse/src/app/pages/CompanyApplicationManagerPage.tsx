import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Loader2, 
  Briefcase, 
  FileText, 
  Calendar, 
  Video, 
  Check, 
  X, 
  UserCheck, 
  UserX,
  Mail,
  User as UserIcon,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { 
  fetchJobApplicationsForRecruiter, 
  updateJobApplicationStatus, 
  scheduleInterviewForCandidate,
  JobApplication,
  Interview
} from '../../lib/recruitment-api';
import { useDataStore } from '../stores/dataStore';
import { MobileContainer } from '../components/MobileContainer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { toCamelCase } from '../../lib/api';
import { getRecommendedCandidates } from '../../lib/recommendation-api';
import { createOrGetChatRoom } from '../../lib/chat-api';
import { useAuthStore } from '../stores/authStore';
import { User } from '../types';
import { UserPortfolio } from '../../lib/portfolio-api';

const PIPELINE_STATUSES: { val: JobApplication['status']; label: string; color: string }[] = [
  { val: 'applied', label: 'Applied', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { val: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { val: 'interview_scheduled', label: 'Interviewing', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { val: 'accepted', label: 'Offer Sent', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { val: 'rejected', label: 'Archived', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
];

export function CompanyApplicationManagerPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobAnnouncements } = useDataStore();
  const { userId } = useAuthStore();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  
  // Advanced Talent Recommendations State
  const [isTalentsOpen, setIsTalentsOpen] = useState(false);
  const [talents, setTalents] = useState<any[]>([]);
  const [loadingTalents, setLoadingTalents] = useState(false);
  const [messagingId, setMessagingId] = useState<string | null>(null);

  // Interview Dialog State
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [interviewTitle, setInterviewTitle] = useState('SkillBridge Professional Interview');
  const [interviewTime, setInterviewTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const job = jobAnnouncements.find(j => j.id === jobId);

  const loadTalentsRecommendations = async () => {
    if (!job) return;
    setLoadingTalents(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'user');

      if (usersError) throw usersError;

      const { data: portfoliosData, error: portfoliosError } = await supabase
        .from('portfolios')
        .select(`
          *,
          projects:portfolio_projects(*),
          experiences:portfolio_experiences(*)
        `);

      if (portfoliosError) throw portfoliosError;

      const rawUsers = toCamelCase(usersData) as User[];
      const rawPortfolios = toCamelCase(portfoliosData) as any[];

      const candidates = rawUsers.map(user => {
        const port = rawPortfolios.find(p => p.userId === user.id) || null;
        return { user, portfolio: port };
      });

      const scored = getRecommendedCandidates(job, candidates);
      setTalents(scored);
    } catch (err: any) {
      toast.error('Failed to compute recommendations: ' + err.message);
    } finally {
      setLoadingTalents(false);
    }
  };

  const handleMessageCandidate = async (candidateId: string) => {
    if (!userId) return;
    setMessagingId(candidateId);
    try {
      const room = await createOrGetChatRoom(userId, candidateId);
      navigate(`/chats/${room.id}`);
    } catch (err: any) {
      toast.error('Failed to start chat: ' + err.message);
    } finally {
      setMessagingId(null);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    async function loadApplicants() {
      try {
        const data = await fetchJobApplicationsForRecruiter(jobId!);
        setApplications(data);
      } catch (err: any) {
        toast.error('Failed to load applicants: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (appId: string, nextStatus: JobApplication['status']) => {
    try {
      const updated = await updateJobApplicationStatus(appId, nextStatus);
      setApplications(prev => prev.map(a => a.id === appId ? updated : a));
      if (selectedApp?.id === appId) {
        setSelectedApp(updated);
      }
      toast.success(`Candidate status moved to ${nextStatus}.`);
    } catch (err: any) {
      toast.error('Status update failed: ' + err.message);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !interviewTime) return;
    setScheduling(true);

    try {
      const interviewData: Interview = {
        applicationId: selectedApp.id,
        title: interviewTitle,
        scheduledTime: new Date(interviewTime).toISOString(),
        meetingLink: meetingLink || undefined,
      };

      await scheduleInterviewForCandidate(interviewData);
      
      // Update local state to interview_scheduled
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'interview_scheduled' } : a));
      setSelectedApp(prev => prev ? { ...prev, status: 'interview_scheduled' } : null);
      
      setIsInterviewOpen(false);
      toast.success('Interview scheduled and candidate notified.');
    } catch (err: any) {
      toast.error('Failed to schedule interview: ' + err.message);
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Loading application pipeline...</span>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background/30 overflow-y-auto pb-10 scrollbar-hide">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-foreground">Hiring Pipeline</h2>
            <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
              {job?.title || 'Job Announcement'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => {
              setIsTalentsOpen(true);
              loadTalentsRecommendations();
            }}
            variant="outline"
            className="text-[10px] h-8 border-primary/25 hover:border-primary/50 font-bold text-primary rounded-full px-3 py-1 flex items-center bg-primary/5 gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            Matching Talents
          </Button>
          <Badge className="bg-muted text-muted-foreground border-0 rounded-full text-[10px] h-8 px-2.5 flex items-center justify-center font-bold">
            {applications.length} Applicants
          </Badge>
        </div>
      </div>

      {/* Candidate Pipeline Rows */}
      <div className="p-5 flex flex-col gap-6">
        {PIPELINE_STATUSES.map((status) => {
          const statusApps = applications.filter(a => a.status === status.val);
          return (
            <div key={status.val} className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${status.val === 'accepted' ? 'bg-emerald-500' : status.val === 'rejected' ? 'bg-rose-500' : 'bg-primary'}`} />
                  {status.label}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold">
                  {statusApps.length}
                </span>
              </div>

              {statusApps.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-[10px] bg-muted/5 rounded-xl border border-dashed border-border/80">
                  Empty stage
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {statusApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer bg-card shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {app.user?.name.substring(0, 2).toUpperCase() || 'SB'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{app.user?.name}</h4>
                          <p className="text-[9px] text-muted-foreground truncate max-w-[150px]">
                            {app.user?.profession || 'Professional'}
                          </p>
                        </div>
                      </div>
                      <Badge className={`text-[9px] px-2 py-0.5 rounded-full ${status.color}`}>
                        Review
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Candidate detail drawer */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={(val) => !val && setSelectedApp(null)}>
          <DialogContent className="max-w-[440px] max-h-[85vh] overflow-y-auto rounded-3xl p-5 gap-0">
            <DialogHeader className="border-b border-border pb-3 mb-4 flex flex-row items-center justify-between">
              <DialogTitle className="text-sm font-bold">Applicant Details</DialogTitle>
              <button 
                onClick={() => setSelectedApp(null)} 
                className="p-1 hover:bg-muted text-muted-foreground rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogHeader>

            {/* Profile Detail */}
            <div className="flex items-center gap-3.5 mb-5 bg-muted/20 p-4 rounded-2xl border border-border/60">
              <AvatarWithInitials name={selectedApp.user?.name || 'SB'} />
              <div>
                <h4 className="text-xs font-bold text-foreground">{selectedApp.user?.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{selectedApp.user?.profession}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" /> {selectedApp.user?.email}</span>
                </div>
              </div>
            </div>

            {/* Cover letter section */}
            {selectedApp.coverLetter && (
              <div className="mb-5">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Cover Letter</h5>
                <p className="text-xs text-foreground/80 bg-muted/10 p-3 rounded-xl border border-border leading-relaxed whitespace-pre-line">
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            {/* Resume button */}
            <div className="mb-5">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Attached Documents</h5>
              <a
                href={selectedApp.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted no-underline text-foreground text-xs font-medium"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                  <span>Resume_CV.pdf</span>
                </div>
                <Badge variant="outline" className="text-[9px] rounded-full uppercase">Open</Badge>
              </a>
            </div>

            {/* Application Pipeline controls */}
            <div className="border-t border-border pt-4 mt-2">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Hiring Decision</h5>
              <div className="grid grid-cols-2 gap-2">
                {selectedApp.status === 'applied' && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'shortlisted')}
                    className="rounded-full text-xs h-9 font-bold bg-primary text-primary-foreground"
                  >
                    Shortlist
                  </Button>
                )}
                
                {['applied', 'shortlisted'].includes(selectedApp.status) && (
                  <Button
                    onClick={() => setIsInterviewOpen(true)}
                    className="rounded-full text-xs h-9 font-bold bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Schedule Interview
                  </Button>
                )}

                {selectedApp.status === 'interview_scheduled' && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'accepted')}
                    className="rounded-full text-xs h-9 font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Accept Candidate
                  </Button>
                )}

                {selectedApp.status !== 'rejected' && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    variant="outline"
                    className="rounded-full text-xs h-9 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 col-span-2"
                  >
                    Reject Candidate
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Interview Modal Dialog */}
      {isInterviewOpen && selectedApp && (
        <Dialog open={isInterviewOpen} onOpenChange={(val) => !val && setIsInterviewOpen(false)}>
          <DialogContent className="max-w-[400px] rounded-3xl p-5">
            <DialogHeader className="border-b border-border pb-3 mb-4 flex flex-row items-center justify-between">
              <DialogTitle className="text-sm font-bold">Schedule Interview</DialogTitle>
              <button 
                onClick={() => setIsInterviewOpen(false)} 
                className="p-1 hover:bg-muted text-muted-foreground rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogHeader>

            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Interview Title
                </label>
                <Input
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Interview Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Meeting Video Link (Google Meet / Teams)
                </label>
                <Input
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={scheduling}
                className="w-full rounded-full h-9 text-xs flex items-center justify-center gap-1.5 font-bold mt-2"
              >
                {scheduling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Schedule & Notify Candidate</span>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Recommended Talents Modal Dialog */}
      {isTalentsOpen && (
        <Dialog open={isTalentsOpen} onOpenChange={(val) => !val && setIsTalentsOpen(false)}>
          <DialogContent className="max-w-[420px] rounded-3xl p-5 max-h-[85vh] flex flex-col">
            <DialogHeader className="border-b border-border pb-3 flex flex-row items-center justify-between shrink-0">
              <DialogTitle className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Matching Talents Recommendation
              </DialogTitle>
              <button 
                onClick={() => setIsTalentsOpen(false)} 
                className="p-1 hover:bg-muted text-muted-foreground rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-3.5 pt-4 scrollbar-hide">
              {loadingTalents ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-[10px] font-semibold">Scoring candidate matches...</span>
                </div>
              ) : talents.length === 0 ? (
                <div className="text-center py-16 text-xs text-muted-foreground">
                  No registered users matching job description requirements.
                </div>
              ) : (
                talents.map((t) => (
                  <div 
                    key={t.item.user.id} 
                    className="p-3.5 border border-border/80 rounded-2xl bg-card/50 flex flex-col gap-3 shadow-sm hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/15">
                          {t.item.user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate max-w-[170px]">{t.item.user.name}</h4>
                          <p className="text-[10px] text-primary font-semibold truncate max-w-[170px] mt-0.5">{t.item.user.profession}</p>
                        </div>
                      </div>

                      <Badge 
                        variant="secondary" 
                        className={`text-[9px] font-bold border-0 rounded-full py-0.5 px-2 shrink-0 ${
                          t.score >= 75 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : t.score >= 45 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t.score}% Match
                      </Badge>
                    </div>

                    {t.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {t.matchedSkills.slice(0, 4).map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="bg-primary/5 text-primary border-0 text-[9px] py-0">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-1 pt-2 border-t border-border/40">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/chats`)}
                        className="text-[10px] h-7 font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full px-3"
                        disabled={messagingId === t.item.user.id}
                      >
                        Go to Chats
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleMessageCandidate(t.item.user.id)}
                        className="text-[10px] h-7 font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-full px-3 flex items-center gap-1"
                        disabled={messagingId === t.item.user.id}
                      >
                        {messagingId === t.item.user.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AvatarWithInitials({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}
