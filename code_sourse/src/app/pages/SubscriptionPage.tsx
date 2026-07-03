import { useNavigate } from 'react-router';
import { SubscriptionScreen } from '../components/SubscriptionScreen';
import { useAuthStore } from '../stores/authStore';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return (
    <SubscriptionScreen
      onBack={() => navigate(-1)}
      onSubscribe={(plan: 'free' | 'premium') => {
        setAuth({ userType: plan });
        navigate('/home');
      }}
    />
  );
}
