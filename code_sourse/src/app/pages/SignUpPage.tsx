import { useNavigate } from 'react-router';
import { SignUpScreen } from '../components/AuthScreens';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export function SignUpPage() {
  const navigate = useNavigate();
  const userRole = useAuthStore((s) => s.userRole);
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
    // AuthProvider handles navigation after auth state change
  };

  return (
    <SignUpScreen
      selectedRole={userRole}
      onComplete={handleComplete}
      onBack={() => navigate('/')}
      onLogin={() => navigate('/login')}
    />
  );
}
