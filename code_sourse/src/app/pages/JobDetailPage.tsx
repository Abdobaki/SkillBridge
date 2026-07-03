import { useNavigate, useParams } from 'react-router';
import { JobDetailScreen } from '../components/JobDetailScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { MobileContainer } from '../components/MobileContainer';
import { toast } from 'sonner';
import { applyToJob, withdrawApplication } from '../../lib/api';

export function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { userType, userRole } = useAuthStore();
  const {
    jobAnnouncements,
    courses,
    savedItems,
    toggleSavedItem,
    appliedJobIds,
    addAppliedJobId,
    removeAppliedJobId,
  } = useDataStore();
  const { userEmail, userName } = useAuthStore();

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
    />
  );
}
