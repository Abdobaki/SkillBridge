import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { JobDetailScreen } from '../components/JobDetailScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { MobileContainer } from '../components/MobileContainer';
import { toast } from 'sonner';
import { applyToJob } from '../../lib/api';
import { fetchUserPortfolio, UserPortfolio } from '../../lib/portfolio-api';
import { calculateJobMatchScore } from '../../lib/recommendation-api';
import { User } from '../types';

export function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { userType, userRole, userId, userEmail, userName, userProfession } = useAuthStore();
  const {
    jobAnnouncements,
    courses,
    savedItems,
    toggleSavedItem,
    appliedJobIds,
    addAppliedJobId,
  } = useDataStore();

  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function loadPortfolio() {
      try {
        const data = await fetchUserPortfolio(userId);
        setPortfolio(data);
      } catch {
        // ignore fallback
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [userId]);

  const job = jobAnnouncements.find((j) => j.id === jobId);

  if (!job) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Job not found.
        </div>
      </MobileContainer>
    );
  }

  const relatedCourses = courses.filter((c) => c.relatedJobId === job.id);

  const handleApply = async () => {
    try {
      await applyToJob(job.id, userEmail, userName);
      addAppliedJobId(job.id);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      if (err.message?.includes('duplicate')) {
        toast.info('You have already applied to this job.');
      } else {
        toast.error('Failed to apply: ' + err.message);
      }
    }
  };

  const currentUser: User = {
    id: userId,
    name: userName,
    email: userEmail,
    profession: userProfession,
    country: '',
    subscriptionType: userType,
    role: userRole,
    bio: ''
  };

  // Compute Match Score
  const matchResult = calculateJobMatchScore(currentUser, portfolio, job);

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Loading job details...</span>
        </div>
      </MobileContainer>
    );
  }

  return (
    <JobDetailScreen
      job={job}
      userType={userType}
      userRole={userRole}
      relatedCourses={relatedCourses}
      onBack={() => navigate(-1)}
      onUpgrade={() => navigate('/subscription')}
      onProposeCourse={() => navigate('/trainer/propose-course')}
      onCourseClick={(course) => navigate(`/course/${course.id}`)}
      isSaved={savedItems.includes(`job:${job.id}`)}
      onSaveToggle={() => toggleSavedItem(`job:${job.id}`)}
      isApplied={appliedJobIds.includes(job.id)}
      onApply={handleApply}
      matchScore={matchResult.score}
      matchedSkills={matchResult.matchedSkills}
    />
  );
}

// Simple local Loader fallback if not imported
import { Loader2 } from 'lucide-react';
