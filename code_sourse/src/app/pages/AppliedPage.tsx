import { useNavigate } from 'react-router';
import { AppliedScreen } from '../components/AppliedScreen';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import { withdrawApplication } from '../../lib/api';
import { JobAnnouncement } from '../types';

export function AppliedPage() {
  const navigate = useNavigate();
  const { jobAnnouncements, appliedJobIds, removeAppliedJobId } =
    useDataStore();

  const allApprovedJobs = jobAnnouncements.filter(
    (j) => j.postStatus === 'approved'
  );
  const appliedJobs = allApprovedJobs.filter((job) =>
    appliedJobIds.includes(job.id)
  );

  const handleWithdraw = async (jobId: string) => {
    try {
      await withdrawApplication(jobId);
      removeAppliedJobId(jobId);
      toast.success('Application withdrawn.');
    } catch (err: any) {
      toast.error('Failed to withdraw: ' + err.message);
    }
  };

  return (
    <AppliedScreen
      appliedJobs={appliedJobs}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onWithdraw={handleWithdraw}
      onBack={() => navigate('/profile')}
    />
  );
}
