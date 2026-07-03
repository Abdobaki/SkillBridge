import { Outlet } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { AppBottomNav } from '../components/AppBottomNav';

/**
 * AppLayout wraps the main user-facing screens with the MobileContainer
 * and BottomNav. The <Outlet /> renders the matched child route.
 */
export function AppLayout() {
  return (
    <MobileContainer>
      <Outlet />
      <AppBottomNav />
    </MobileContainer>
  );
}
