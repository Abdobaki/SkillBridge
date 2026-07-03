import { useNavigate } from 'react-router';
import { RoleSelectionScreen } from '../components/RoleSelectionScreen';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleRoleSelection = (role: UserRole) => {
    setAuth({ userRole: role });
    if (role === 'trainer') {
      navigate('/trainer/apply');
    } else {
      navigate('/signup');
    }
  };

  return (
    <RoleSelectionScreen
      onSelectRole={handleRoleSelection}
      onBack={() => navigate('/')}
    />
  );
}
