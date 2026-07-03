import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AdminTrainerApprovalScreen } from '../../components/AdminTrainerApprovalScreen';
import { useDataStore } from '../../stores/dataStore';
import {
  signOutUser,
  updateApplicationStatus,
  triggerDeadlineReminders,
} from '../../../lib/api';

export function AdminTrainerApprovalPage() {
  const navigate = useNavigate();
  const { trainerApplications, updateTrainerApplication } =
    useDataStore();

  return (
    <AdminTrainerApprovalScreen
      applications={trainerApplications}
      onBack={() => {
        // no-op — admin stays on dashboard
      }}
      onLogout={async () => {
        try {
          await signOutUser();
        } catch {
          // ignore
        }
      }}
      onApprove={async (applicationId) => {
        try {
          const updated = await updateApplicationStatus(
            applicationId,
            'approved'
          );
          updateTrainerApplication(applicationId, updated);
          toast.success('Trainer application approved successfully!');
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
      onReject={async (applicationId, feedback) => {
        try {
          const updated = await updateApplicationStatus(
            applicationId,
            'rejected',
            feedback
          );
          updateTrainerApplication(applicationId, updated);
          toast.info(
            'Trainer application rejected with feedback sent to trainer.'
          );
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
      onNavigateToCourseApproval={() => navigate('/admin/courses')}
      onNavigateToJobApproval={() => navigate('/admin/jobs')}
      onPostJob={() => navigate('/post-job')}
      onNavigateToJobHistory={() => navigate('/admin/job-history')}
      onSendReminders={async () => {
        try {
          const result = await triggerDeadlineReminders();
          if (result.emailsSent > 0) {
            toast.success(
              `Sent ${result.emailsSent} reminder email(s)!`
            );
          } else {
            toast.info(
              result.message || 'No reminders to send right now.'
            );
            if (result.debug) {
              alert(
                `DEBUG INFO:\nJobs Found: ${result.debug.jobsFound}\nApplications Found: ${result.debug.applicationsFound}\nFailures: ${result.debug.emailFailures.join(', ')}`
              );
            }
          }
          return result;
        } catch (err: any) {
          toast.error('Failed to send reminders: ' + err.message);
          return { emailsSent: 0 };
        }
      }}
    />
  );
}
