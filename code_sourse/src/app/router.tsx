import { createBrowserRouter } from 'react-router';

// Layouts
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Route Pages
import { OnboardingPage } from './pages/OnboardingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CoursesPage } from './pages/CoursesPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AppliedPage } from './pages/AppliedPage';
import { PostJobPage } from './pages/PostJobPage';
import { CourseChatPage } from './pages/CourseChatPage';

// Trainer Pages
import { TrainerApplicationPage } from './pages/trainer/TrainerApplicationPage';
import { TrainerPendingPage } from './pages/trainer/TrainerPendingPage';
import { TrainerDashboardPage } from './pages/trainer/TrainerDashboardPage';
import { TrainerBrowseJobsPage } from './pages/trainer/TrainerBrowseJobsPage';
import { CourseProposalPage } from './pages/trainer/CourseProposalPage';

// Admin Pages
import { AdminTrainerApprovalPage } from './pages/admin/AdminTrainerApprovalPage';
import { AdminCourseApprovalPage } from './pages/admin/AdminCourseApprovalPage';
import { AdminJobApprovalPage } from './pages/admin/AdminJobApprovalPage';
import { AdminJobHistoryPage } from './pages/admin/AdminJobHistoryPage';

// Feed Pages
import { FeedPage } from './pages/FeedPage';

// Company Pages
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { CompanyEditPage } from './pages/CompanyEditPage';

import { AuthProvider } from './context/AuthProvider';
import { Outlet } from 'react-router';

function RootWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    children: [
      // Auth routes (no bottom nav)
      {
        element: <AuthLayout />,
        children: [
          { path: '/', element: <OnboardingPage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignUpPage /> },
          { path: '/role-selection', element: <RoleSelectionPage /> },
          { path: '/subscription', element: <SubscriptionPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/applied', element: <AppliedPage /> },

          // Trainer auth-like routes
          { path: '/trainer/apply', element: <TrainerApplicationPage /> },
          { path: '/trainer/pending', element: <TrainerPendingPage /> },

          // Standalone detail routes (no bottom nav, has back button)
          { path: '/job/:jobId', element: <JobDetailPage /> },
          { path: '/course/:courseId', element: <CourseDetailPage /> },
          { path: '/course/:courseId/chat', element: <CourseChatPage /> },
          { path: '/post-job', element: <PostJobPage /> },
          { path: '/company/:companyId', element: <CompanyProfilePage /> },
          { path: '/company/:companyId/edit', element: <CompanyEditPage /> },

          // Course Proposal
          { path: '/trainer/propose-course', element: <CourseProposalPage /> },
        ],
      },

      // Main app routes (with bottom nav)
      {
        element: <AppLayout />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/feed', element: <FeedPage /> },
          { path: '/explore', element: <ExplorePage /> },
          { path: '/courses', element: <CoursesPage /> },
          { path: '/saved', element: <SavedPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },

      // Trainer dashboard routes (no standard bottom nav)
      {
        element: <AuthLayout />,
        children: [
          { path: '/trainer/dashboard', element: <TrainerDashboardPage /> },
          {
            path: '/trainer/browse-jobs',
            element: <TrainerBrowseJobsPage />,
          },
        ],
      },

      // Admin routes (no standard bottom nav)
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/admin/trainers',
            element: <AdminTrainerApprovalPage />,
          },
          {
            path: '/admin/courses',
            element: <AdminCourseApprovalPage />,
          },
          { path: '/admin/jobs', element: <AdminJobApprovalPage /> },
          {
            path: '/admin/job-history',
            element: <AdminJobHistoryPage />,
          },
        ],
      },
    ],
  }
]);

