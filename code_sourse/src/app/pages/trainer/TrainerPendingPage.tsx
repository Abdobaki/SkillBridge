import { useNavigate } from 'react-router';
import { TrainerPendingApprovalScreen } from '../../components/TrainerPendingApprovalScreen';
import { useAuthStore } from '../../stores/authStore';
import { signOutUser } from '../../../lib/api';

export function TrainerPendingPage() {
  const navigate = useNavigate();
  const { userName, userEmail, trainerStatus } = useAuthStore();

  return (
    <TrainerPendingApprovalScreen
      trainerName={userName}
      trainerEmail={userEmail}
      status={trainerStatus}
      onBack={async () => {
        try {
          await signOutUser();
        } catch {
          // ignore
        }
      }}
    />
  );
}
