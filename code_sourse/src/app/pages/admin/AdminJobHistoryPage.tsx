import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AdminJobHistoryScreen } from '../../components/AdminJobHistoryScreen';
import { useDataStore } from '../../stores/dataStore';
import {
  deleteJob as deleteJobApi,
  updateJob as updateJobApi,
} from '../../../lib/api';
import { JobAnnouncement } from '../../types';

export function AdminJobHistoryPage() {
  const navigate = useNavigate();
  const { jobAnnouncements, removeJob, updateJob } = useDataStore();

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJobApi(jobId);
      removeJob(jobId);
      toast.success('Job deleted successfully.');
    } catch (err: any) {
      toast.error('Failed to delete job: ' + err.message);
    }
  };

  const handleUpdateJob = async (
    jobId: string,
    updates: Partial<JobAnnouncement>
  ) => {
    try {
      const updated = await updateJobApi(jobId, updates);
      updateJob(jobId, updated);
      toast.success('Job updated successfully.');
    } catch (err: any) {
      toast.error('Failed to update job: ' + err.message);
    }
  };

  return (
    <AdminJobHistoryScreen
      jobs={jobAnnouncements}
      onBack={() => navigate('/admin/trainers')}
      onDeleteJob={handleDeleteJob}
      onUpdateJob={handleUpdateJob}
    />
  );
}
