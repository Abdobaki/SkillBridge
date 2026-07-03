import { Outlet } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';

/**
 * AuthLayout wraps onboarding, login, signup, and role selection screens.
 * No bottom navigation is shown.
 */
export function AuthLayout() {
  return (
    <MobileContainer>
      <Outlet />
    </MobileContainer>
  );
}
