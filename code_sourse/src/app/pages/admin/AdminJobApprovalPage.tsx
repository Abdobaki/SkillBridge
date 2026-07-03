import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AdminJobApprovalScreen } from '../../components/AdminJobApprovalScreen';
import { useDataStore } from '../../stores/dataStore';
import {
  updateJobStatus,
  triggerNotification,
} from '../../../lib/api';

export function AdminJobApprovalPage() {
  const navigate = useNavigate();
  const { jobAnnouncements, updateJob } = useDataStore();

  return (
    <AdminJobApprovalScreen
      jobs={jobAnnouncements}
      onBack={() => navigate('/admin/trainers')}
      onApprove={async (jobId) => {
        try {
          const updatedJob = await updateJobStatus(jobId, 'approved');
          updateJob(jobId, updatedJob);
          toast.success('Job announcement approved and published!');
          triggerNotification('new_job', {
            jobTitle: updatedJob.title,
            company: updatedJob.company,
            location: updatedJob.location,
            deadline: updatedJob.applicationDeadline,
          }).catch(() => {});
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
      onReject={async (jobId, feedback) => {
        try {
          const updatedJob = await updateJobStatus(
            jobId,
            'rejected',
            feedback
          );
          updateJob(jobId, updatedJob);
          toast.info(
            'Job announcement rejected with feedback sent to poster.'
          );
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
    />
  );
}
