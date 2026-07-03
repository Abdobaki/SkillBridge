import { useNavigate } from 'react-router';
import { Onboarding } from '../components/Onboarding';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <Onboarding
      onComplete={() => navigate('/role-selection')}
      onLogin={() => navigate('/login')}
    />
  );
}
