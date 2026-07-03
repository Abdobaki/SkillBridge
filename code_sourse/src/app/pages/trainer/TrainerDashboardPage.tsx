import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { TrainerDashboard } from '../../components/TrainerDashboard';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { signOutUser } from '../../../lib/api';

export function TrainerDashboardPage() {
  const navigate = useNavigate();
  const { userName, userEmail } = useAuthStore();
  const { courseProposals, enrollments } = useDataStore();

  return (
    <TrainerDashboard
      trainerName={userName}
      trainerEmail={userEmail}
      proposals={courseProposals.filter(
        (p) => p.trainerEmail === userEmail
      )}
      enrollments={enrollments}
      onBack={async () => {
        try {
          await signOutUser();
        } catch {
          // ignore
        }
      }}
      onEditProposal={(proposal) => {
        // Store the proposal for editing — using sessionStorage as a bridge
        sessionStorage.setItem(
          'editingProposal',
          JSON.stringify(proposal)
        );
        navigate('/trainer/propose-course');
      }}
      onBrowseJobs={() => navigate('/trainer/browse-jobs')}
      onViewProposals={() => {
        toast.info(
          'Viewing detailed proposals list will be available soon.'
        );
      }}
      onPostJob={() => navigate('/post-job')}
    />
  );
}
