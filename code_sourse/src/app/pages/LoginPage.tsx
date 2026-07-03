import { useNavigate } from 'react-router';
import { LoginScreen } from '../components/AuthScreens';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleComplete = (userData: {
    name: string;
    email: string;
    role?: UserRole;
  }) => {
    setAuth({
      userName: userData.name,
      userEmail: userData.email,
      ...(userData.role ? { userRole: userData.role } : {}),
    });
    // The AuthProvider's onAuthStateChange will handle the actual navigation
  };

  return (
    <LoginScreen
      onComplete={handleComplete}
      onBack={() => navigate('/')}
      onSignUp={() => navigate('/role-selection')}
    />
  );
}
