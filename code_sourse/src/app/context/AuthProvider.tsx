import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import {
  getCurrentUser,
  fetchJobs,
  fetchProposals,
  fetchTrainerApplications,
  fetchEnrollments,
  fetchCourses,
  fetchUserApplications,
} from '../../lib/api';
import { UserRole, TrainerStatus } from '../types';

const AUTH_ROUTES = ['/', '/login', '/signup', '/role-selection'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, setInitializing, reset } = useAuthStore();
  const {
    setJobs,
    setProposals,
    setTrainerApplications,
    setEnrollments,
    setCourses,
    setAppliedJobIds,
    trainerApplications,
  } = useDataStore();

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const [jobs, proposals, apps, enrolls, dbCourses, userApps] =
          await Promise.all([
            fetchJobs(),
            fetchProposals(),
            fetchTrainerApplications(),
            fetchEnrollments(),
            fetchCourses(),
            fetchUserApplications(),
          ]);
        if (!mounted) return;
        setJobs(jobs);
        setProposals(proposals);
        setTrainerApplications(apps);
        setEnrollments(enrolls);
        setCourses(dbCourses);
        setAppliedJobIds(userApps.map((a: any) => a.jobId));
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    async function handleAuthUser() {
      const result = await getCurrentUser();
      if (!mounted) return;
      if (!result) return;
      const { profile } = result;
      if (profile) {
        setAuth({
          isAuthenticated: true,
          userId: profile.id,
          userName: profile.name || 'User',
          userEmail: profile.email || '',
          userRole: (profile.role as UserRole) || 'user',
          trainerStatus:
            (profile.trainerStatus as TrainerStatus) || 'pending',
          userProfession: profile.profession || 'Professional',
          profileImage: profile.profileImage,
        });

        // Auto-navigate past auth screens if logged in
        const currentPath = location.pathname;
        if (AUTH_ROUTES.includes(currentPath)) {
          let nextPath = '/home';
          if (profile.role === 'admin') {
            nextPath = '/admin/trainers';
          } else if (profile.role === 'trainer') {
            // Check trainer application status using fresh data from store
            const apps = useDataStore.getState().trainerApplications;
            const application = apps.find(
              (app) => app.email === profile.email
            );
            if (application) {
              if (application.status === 'approved') {
                nextPath = '/trainer/dashboard';
              } else {
                nextPath = '/trainer/pending';
              }
            } else {
              if (profile.trainerStatus === 'approved')
                nextPath = '/trainer/dashboard';
              else if (profile.trainerStatus === 'rejected')
                nextPath = '/trainer/pending';
              else nextPath = '/trainer/apply';
            }
          }
          navigate(nextPath, { replace: true });
        }
      }
    }

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleAuthUser();
      } else {
        reset();
        const currentPath = location.pathname;
        if (!AUTH_ROUTES.includes(currentPath)) {
          navigate('/', { replace: true });
        }
      }
    });

    // Run once on mount
    loadInitialData();
    handleAuthUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
