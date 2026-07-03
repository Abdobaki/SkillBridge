import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { TrainerApplicationForm } from '../../components/TrainerApplicationForm';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { signUpUser, submitTrainerApplication } from '../../../lib/api';
import { TrainerStatus } from '../../types';

export function TrainerApplicationPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { addTrainerApplication } = useDataStore();

  return (
    <TrainerApplicationForm
      isSignupMode={true}
      onBack={() => navigate('/role-selection')}
      onSubmit={async (application, signupData) => {
        try {
          if (signupData?.password) {
            await signUpUser(
              application.email,
              signupData.password,
              application.name,
              'trainer',
              application.profession,
              signupData.country || ''
            );
          }

          const saved = await submitTrainerApplication(application);
          addTrainerApplication(saved);
          setAuth({
            userName: saved.name,
            userEmail: saved.email,
            trainerStatus: saved.status as TrainerStatus,
          });
          toast.success(
            'Trainer account created & application submitted!'
          );
          navigate('/trainer/pending');
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
    />
  );
}
