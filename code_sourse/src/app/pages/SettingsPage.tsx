import { useNavigate } from 'react-router';
import { SettingsScreen } from '../components/SettingsScreen';

export function SettingsPage() {
  const navigate = useNavigate();

  return <SettingsScreen onBack={() => navigate('/profile')} />;
}
