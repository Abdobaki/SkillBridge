import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppliedScreen } from '../components/AppliedScreen';
import { useDataStore } from '../stores/dataStore';
import { toast } from 'sonner';
import { withdrawApplication } from '../../lib/api';
import { fetchUserApplicationsDetail } from '../../lib/recruitment-api';
import { JobAnnouncement } from '../types';

export function AppliedPage() {
  const navigate = useNavigate();
  const { removeAppliedJobId } = useDataStore();
  const [applications, setApplications] = useState<(JobAnnouncement & { status?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await fetchUserApplicationsDetail();
        // Map the results: extracting the inner job details and injecting the application status
        const mappedJobs = data
          .filter(app => app.job)
          .map(app => ({
            ...app.job,
            status: app.status
          }));
        setApplications(mappedJobs);
      } catch (err: any) {
        toast.error('Failed to load application status details: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const handleWithdraw = async (jobId: string) => {
    try {
      await withdrawApplication(jobId);
      removeAppliedJobId(jobId);
      setApplications(prev => prev.filter(job => job.id !== jobId));
      toast.success('Application withdrawn.');
    } catch (err: any) {
      toast.error('Failed to withdraw: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-muted-foreground gap-2">
        <span className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs font-semibold">Loading applications tracker...</span>
      </div>
    );
  }

  return (
    <AppliedScreen
      appliedJobs={applications}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onWithdraw={handleWithdraw}
      onBack={() => navigate('/profile')}
    />
  );
}
