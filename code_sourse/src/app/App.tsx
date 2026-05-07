import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { MobileContainer } from './components/MobileContainer';
import { Onboarding } from './components/Onboarding';
import { LoginScreen, SignUpScreen } from './components/AuthScreens';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { CoursesScreen } from './components/CoursesScreen';
import { SavedScreen } from './components/SavedScreen';
import { AppliedScreen } from './components/AppliedScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { JobDetailScreen } from './components/JobDetailScreen';
import { CourseDetailScreen } from './components/CourseDetailScreen';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { TrainerApplicationForm } from './components/TrainerApplicationForm';
import { TrainerPendingApprovalScreen } from './components/TrainerPendingApprovalScreen';
import { TrainerDashboard } from './components/TrainerDashboard';
import { AdminApprovalScreen } from './components/AdminApprovalScreen';
import { AdminTrainerApprovalScreen } from './components/AdminTrainerApprovalScreen';
import { AdminJobApprovalScreen } from './components/AdminJobApprovalScreen';
import { AdminJobHistoryScreen } from './components/AdminJobHistoryScreen';
import { CourseProposalForm } from './components/CourseProposalForm';
import { TrainerJobBrowseScreen } from './components/TrainerJobBrowseScreen';
import { PostJobForm } from './components/PostJobForm';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { UserType, UserRole, JobAnnouncement, Course, CourseProposal, Enrollment, TrainerApplication, TrainerStatus } from './types';
import { supabase } from '../lib/supabase';
import {
  getCurrentUser, fetchJobs, fetchProposals, fetchTrainerApplications, fetchEnrollments, fetchCourses, signOutUser, createJob, updateJobStatus, saveProposal, updateProposalStatus, submitTrainerApplication, updateApplicationStatus, signUpUser, createCourse, applyToJob, withdrawApplication, fetchUserApplications, deleteJob, updateJob, triggerDeadlineReminders, updateUserProfile, uploadProfileImage
} from '../lib/api';

type Screen =
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'role-selection'
  | 'trainer-application'
  | 'trainer-pending'
  | 'home'
  | 'explore'
  | 'courses'
  | 'saved'
  | 'profile'
  | 'job-detail'
  | 'course-detail'
  | 'subscription'
  | 'trainer-dashboard'
  | 'trainer-browse-jobs'
  | 'admin-approval'
  | 'admin-trainer-approval'
  | 'admin-job-approval'
  | 'propose-course'
  | 'post-job'
  | 'settings'
  | 'applied'
  | 'admin-job-history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState<UserType>('free');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [trainerStatus, setTrainerStatus] = useState<TrainerStatus>('pending');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userProfession, setUserProfession] = useState('Professional');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [exploreCategory, setExploreCategory] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('savedItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('savedItems', JSON.stringify(savedItems));
    } catch {
      // ignore
    }
  }, [savedItems]);
  const [selectedJob, setSelectedJob] = useState<JobAnnouncement | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [jobAnnouncements, setJobAnnouncements] = useState<JobAnnouncement[]>([]);
  const [courseProposals, setCourseProposals] = useState<CourseProposal[]>([]);
  const [editingProposal, setEditingProposal] = useState<CourseProposal | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [trainerApplications, setTrainerApplications] = useState<TrainerApplication[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const currentScreenRef = useRef<Screen>(currentScreen);
  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  const trainerApplicationsRef = useRef<TrainerApplication[]>(trainerApplications);
  useEffect(() => {
    trainerApplicationsRef.current = trainerApplications;
  }, [trainerApplications]);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const [jobs, proposals, apps, enrolls, dbCourses, userApps] = await Promise.all([
          fetchJobs(), fetchProposals(), fetchTrainerApplications(), fetchEnrollments(), fetchCourses(), fetchUserApplications()
        ]);
        if (!mounted) return;
        setJobAnnouncements(jobs);
        setCourseProposals(proposals);
        setTrainerApplications(apps);
        setEnrollments(enrolls);
        setCourses(dbCourses);
        setAppliedJobIds(userApps.map((a: any) => a.jobId));
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        if (mounted) setIsInitializing(false);
      }
    }

    async function handleAuthUser() {
      const result = await getCurrentUser();
      if (!mounted) return;
      if (!result) return;
      const { profile } = result;
      if (profile) {
        setUserName(profile.name || 'User');
        setUserEmail(profile.email || '');
        setUserRole((profile.role as UserRole) || 'user');
        setTrainerStatus((profile.trainerStatus as TrainerStatus) || 'pending');
        setUserProfession(profile.profession || 'Professional');
        setProfileImage(profile.profileImage);

        // Auto-navigate past onboarding if logged in (except if already on a deep screen)
        if (['onboarding', 'login', 'signup', 'role-selection'].includes(currentScreenRef.current)) {
          let nextScreen: Screen = 'home';
          if (profile.role === 'admin') {
            nextScreen = 'admin-trainer-approval';
          } else if (profile.role === 'trainer') {
            const application = trainerApplicationsRef.current.find(app => app.email === profile.email);
            if (application) {
              if (application.status === 'approved') {
                nextScreen = 'trainer-dashboard';
              } else {
                nextScreen = 'trainer-pending';
              }
            } else {
              // Fallback to profile status if fresh fetch hasn't completed
              if (profile.trainerStatus === 'approved') nextScreen = 'trainer-dashboard';
              else if (profile.trainerStatus === 'rejected') nextScreen = 'trainer-pending';
              else nextScreen = 'trainer-application';
            }
          }
          setCurrentScreen(nextScreen);
        }
      }
    }

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleAuthUser();
      } else {
        // User logged out
        setUserName('');
        setUserEmail('');
        setUserRole('user');
        setProfileImage(undefined);
        setCurrentScreen(prev => {
           if (['onboarding', 'login', 'signup', 'role-selection'].includes(prev)) {
             return prev;
           }
           return 'onboarding';
        });
      }
    });

    // Run Once
    loadInitialData();
    handleAuthUser();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Only show approved jobs to regular users and trainers
  // Filter approved jobs and exclude expired ones for user-facing pages
  const allApprovedJobs = jobAnnouncements.filter(j => j.postStatus === 'approved');
  const approvedJobs = allApprovedJobs.filter(j => {
    try {
      const deadline = new Date(j.applicationDeadline);
      return deadline >= new Date();
    } catch {
      return true; // Keep jobs with unparseable dates
    }
  });

  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground">Loading App Data...</div>;
  }

  const handleOnboardingComplete = () => {
    setCurrentScreen('role-selection');
  };

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    if (role === 'trainer') {
      setCurrentScreen('trainer-application');
    } else {
      setCurrentScreen('signup');
    }
  };

  const handleLoginComplete = (userData: { name: string; email: string; role?: UserRole }) => {
    // Only basic state updates here. The active routing is handled by `handleAuthUser` 
    // triggered via `onAuthStateChange` to prevent race conditions and duplicate navigations.
    setUserName(userData.name);
    setUserEmail(userData.email);
    if (userData.role) {
      setUserRole(userData.role);
    }
  };

  const handleUpdateProfile = async (data: { name: string; profession: string; imageFile?: File }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let imageUrl = profileImage;
      if (data.imageFile) {
        imageUrl = await uploadProfileImage(user.id, data.imageFile);
      }

      const updatedProfile = await updateUserProfile(user.id, {
        name: data.name,
        profession: data.profession,
        profileImage: imageUrl
      });

      setUserName(updatedProfile.name);
      setUserProfession(updatedProfile.profession);
      setProfileImage(updatedProfile.profileImage);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update profile: ' + err.message);
      throw err;
    }
  };

  const handleSaveToggle = (id: string, type: 'job' | 'course') => {
    const prefixedId = `${type}:${id}`;
    setSavedItems((prev) =>
      prev.includes(prefixedId) ? prev.filter((item) => item !== prefixedId) : [...prev, prefixedId]
    );
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      await applyToJob(jobId, userEmail, userName);
      setAppliedJobIds(prev => [...prev, jobId]);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      if (err.message?.includes('duplicate')) {
        toast.info('You have already applied to this job.');
      } else {
        toast.error('Failed to apply: ' + err.message);
      }
    }
  };

  const handleWithdrawApplication = async (jobId: string) => {
    try {
      await withdrawApplication(jobId);
      setAppliedJobIds(prev => prev.filter(id => id !== jobId));
      toast.success('Application withdrawn.');
    } catch (err: any) {
      toast.error('Failed to withdraw: ' + err.message);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      setJobAnnouncements(prev => prev.filter(j => j.id !== jobId));
      toast.success('Job deleted successfully.');
    } catch (err: any) {
      toast.error('Failed to delete job: ' + err.message);
    }
  };

  const handleUpdateJob = async (jobId: string, updates: Partial<JobAnnouncement>) => {
    try {
      const updated = await updateJob(jobId, updates);
      setJobAnnouncements(prev => prev.map(j => j.id === jobId ? updated : j));
      toast.success('Job updated successfully.');
    } catch (err: any) {
      toast.error('Failed to update job: ' + err.message);
    }
  };

  const handleJobClick = (job: JobAnnouncement) => {
    setSelectedJob(job);
    setCurrentScreen('job-detail');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCurrentScreen('course-detail');
  };

  const handleSubscribe = (plan: 'free' | 'premium') => {
    setUserType(plan);
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch {
      // ignore
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const screenMap: { [key: string]: Screen } = {
      home: 'home',
      explore: 'explore',
      courses: 'courses',
      saved: 'saved',
      profile: 'profile',
    };
    if (tab !== 'explore') {
      setExploreCategory(null);
    }
    setCurrentScreen(screenMap[tab]);
  };

  const handleUpgradeClick = () => {
    setCurrentScreen('subscription');
  };

  const handlePostJob = async (job: JobAnnouncement) => {
    try {
      const savedJob = await createJob({
        ...job,
        postedByRole: userRole,
        postedByName: userName,
        postedByEmail: userEmail,
      });
      setJobAnnouncements([savedJob, ...jobAnnouncements]);
      if (savedJob.postStatus === 'approved') {
        toast.success('Job announcement published successfully!');
      } else {
        toast.success('Job announcement submitted for admin review!');
      }
      // Navigate back to previous screen
      if (userRole === 'trainer') {
        setCurrentScreen('trainer-dashboard');
      } else if (userRole === 'admin') {
        setCurrentScreen('admin-trainer-approval');
      } else {
        setCurrentScreen('home');
        setActiveTab('home');
      }
    } catch (err: any) {
      toast.error('Failed to post job: ' + err.message);
    }
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      const updatedJob = await updateJobStatus(jobId, 'approved');
      setJobAnnouncements(jobAnnouncements.map((j) => (j.id === jobId ? updatedJob : j)));
      toast.success('Job announcement approved and published!');
    } catch (err: any) { toast.error('Error: ' + err.message); }
  };

  const handleRejectJob = async (jobId: string, feedback: string) => {
    try {
      const updatedJob = await updateJobStatus(jobId, 'rejected', feedback);
      setJobAnnouncements(jobAnnouncements.map((j) => (j.id === jobId ? updatedJob : j)));
      toast.info('Job announcement rejected with feedback sent to poster.');
    } catch (err: any) { toast.error('Error: ' + err.message); }
  };

  const savedJobs = allApprovedJobs.filter((job) =>
    savedItems.includes(`job:${job.id}`)
  );
  const savedCourses = courses.filter((course) =>
    savedItems.includes(`course:${course.id}`)
  );
  const appliedJobs = allApprovedJobs.filter((job) =>
    appliedJobIds.includes(job.id)
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onLogin={() => setCurrentScreen('login')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onComplete={handleLoginComplete}
            onBack={() => setCurrentScreen('onboarding')}
            onSignUp={() => setCurrentScreen('role-selection')}
          />
        );

      case 'signup':
        return (
          <SignUpScreen
            selectedRole={userRole}
            onComplete={handleLoginComplete}
            onBack={() => setCurrentScreen('onboarding')}
            onLogin={() => setCurrentScreen('login')}
          />
        );

      case 'role-selection':
        return (
          <RoleSelectionScreen
            onSelectRole={handleRoleSelection}
            onBack={() => setCurrentScreen('onboarding')}
          />
        );

      case 'home':
        return (
          <>
            <HomeScreen
              userName={userName}
              userType={userType}
              featuredJobs={approvedJobs.slice(0, 3)}
              recommendedCourses={courses.slice(0, 2)}
              onJobClick={handleJobClick}
              onCourseClick={handleCourseClick}
              onCategoryClick={(category) => {
                setExploreCategory(category);
                setActiveTab('explore');
                setCurrentScreen('explore');
              }}
              onUpgradeClick={handleUpgradeClick}
              onPostJob={() => setCurrentScreen('post-job')}
              onSeeAllJobs={() => {
                setExploreCategory(null);
                setActiveTab('explore');
                setCurrentScreen('explore');
              }}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'explore':
        return (
          <>
            <ExploreScreen
              jobs={approvedJobs}
              courses={courses}
              onJobClick={handleJobClick}
              onCourseClick={handleCourseClick}
              onSaveToggle={handleSaveToggle}
              savedItems={savedItems}
              initialCategory={exploreCategory}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'courses':
        return (
          <>
            <CoursesScreen
              courses={courses}
              onCourseClick={handleCourseClick}
              onSaveToggle={handleSaveToggle}
              savedItems={savedItems}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'saved':
        return (
          <>
            <SavedScreen
              savedJobs={savedJobs}
              savedCourses={savedCourses}
              onJobClick={handleJobClick}
              onCourseClick={handleCourseClick}
              onUnsave={handleSaveToggle}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'profile':
        return (
          <>
            <ProfileScreen
              userName={userName}
              userEmail={userEmail}
              userProfession={userProfession}
              userType={userType}
              profileImage={profileImage}
              savedItemsCount={savedItems.length}
              appliedJobsCount={appliedJobIds.length}
              coursesCount={enrollments.filter(e => e.studentEmail === userEmail).length}
              onUpgrade={handleUpgradeClick}
              onLogout={handleLogout}
              onSavedClick={() => {
                setActiveTab('saved');
                setCurrentScreen('saved');
              }}
              onAppliedClick={() => {
                setCurrentScreen('applied');
              }}
              onCoursesClick={() => {
                setActiveTab('courses');
                setCurrentScreen('courses');
              }}
              onUpdateProfile={handleUpdateProfile}
              onSettingsClick={() => setCurrentScreen('settings')}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'settings':
        return (
          <SettingsScreen
            onBack={() => {
              setCurrentScreen('profile');
              setActiveTab('profile');
            }}
          />
        );

      case 'job-detail':
        return selectedJob ? (
          <JobDetailScreen
            job={selectedJob}
            userType={userType}
            userRole={userRole}
            relatedCourses={courses.filter(c => c.relatedJobId === selectedJob.id)}
            onBack={() => {
              if (userRole === 'trainer') {
                setCurrentScreen('trainer-dashboard');
              } else {
                setCurrentScreen(activeTab as Screen);
              }
            }}
            onUpgrade={handleUpgradeClick}
            onProposeCourse={() => {
              setCurrentScreen('propose-course');
            }}
            onCourseClick={handleCourseClick}
            isSaved={savedItems.includes(`job:${selectedJob.id}`)}
            onSaveToggle={() => handleSaveToggle(selectedJob.id, 'job')}
            isApplied={appliedJobIds.includes(selectedJob.id)}
            onApply={() => handleApplyToJob(selectedJob.id)}
          />
        ) : null;

      case 'course-detail':
        return selectedCourse ? (
          <CourseDetailScreen
            course={selectedCourse}
            onBack={() => {
              setCurrentScreen(activeTab as Screen);
            }}
            isSaved={savedItems.includes(`course:${selectedCourse.id}`)}
            onSaveToggle={() => handleSaveToggle(selectedCourse.id, 'course')}
          />
        ) : null;

      case 'subscription':
        return (
          <SubscriptionScreen
            onBack={() => {
              setCurrentScreen(activeTab as Screen);
            }}
            onSubscribe={handleSubscribe}
          />
        );

      case 'trainer-dashboard':
        return (
          <TrainerDashboard
            trainerName={userName}
            trainerEmail={userEmail}
            proposals={courseProposals.filter(p => p.trainerEmail === userEmail)}
            enrollments={enrollments}
            onBack={() => {
              handleLogout();
            }}
            onEditProposal={(proposal) => {
              setEditingProposal(proposal);
              setCurrentScreen('propose-course');
            }}
            onBrowseJobs={() => {
              setCurrentScreen('trainer-browse-jobs');
            }}
            onViewProposals={() => {
              toast.info('Viewing detailed proposals list will be available soon.');
            }}
            onPostJob={() => {
              setCurrentScreen('post-job');
            }}
          />
        );

      case 'admin-approval':
        return (
          <AdminApprovalScreen
            proposals={courseProposals}
            onBack={() => {
              setCurrentScreen('admin-trainer-approval');
            }}
            onApprove={async (proposalId) => {
              try {
                const proposal = courseProposals.find(p => p.id === proposalId);
                if (!proposal) throw new Error("Proposal not found");

                const updated = await updateProposalStatus(proposalId, 'approved');
                setCourseProposals(
                  courseProposals.map((p) => (p.id === proposalId ? updated : p))
                );

                // Create the course
                const newCourseData: Partial<Course> = {
                  title: proposal.courseTitle,
                  instructor: proposal.trainerName,
                  instructorBio: proposal.instructorBio,
                  price: proposal.finalPrice,
                  enrolled: 0,
                  description: proposal.courseDescription,
                  duration: proposal.duration,
                  category: "Professional", // Fallback, could extract from job if available
                  verified: true,
                  relatedJobId: proposal.relatedJobId,
                  status: 'active',
                  minEnrollment: proposal.minStudents,
                };
                
                const createdCourse = await createCourse(newCourseData);
                setCourses([createdCourse, ...courses]);

                toast.success('Course proposal approved and published to courses!');
              } catch (err: any) { toast.error('Error: ' + err.message); }
            }}
            onReject={async (proposalId, feedback) => {
              try {
                const updated = await updateProposalStatus(proposalId, 'rejected', feedback);
                setCourseProposals(
                  courseProposals.map((p) => (p.id === proposalId ? updated : p))
                );
                toast.info('Course proposal rejected with feedback sent to trainer.');
              } catch (err: any) { toast.error('Error: ' + err.message); }
            }}
          />
        );

      case 'admin-trainer-approval':
        return (
          <AdminTrainerApprovalScreen
            applications={trainerApplications}
            onBack={() => {
              // no-op — admin stays on dashboard, use logout to leave
            }}
            onLogout={handleLogout}
            onApprove={async (applicationId) => {
              try {
                const updated = await updateApplicationStatus(applicationId, 'approved');
                setTrainerApplications(
                  trainerApplications.map((app) => (app.id === applicationId ? updated : app))
                );
                toast.success('Trainer application approved successfully!');
              } catch (err: any) { toast.error('Error: ' + err.message); }
            }}
            onReject={async (applicationId, feedback) => {
              try {
                const updated = await updateApplicationStatus(applicationId, 'rejected', feedback);
                setTrainerApplications(
                  trainerApplications.map((app) => (app.id === applicationId ? updated : app))
                );
                toast.info('Trainer application rejected with feedback sent to trainer.');
              } catch (err: any) { toast.error('Error: ' + err.message); }
            }}
            onNavigateToCourseApproval={() => {
              setCurrentScreen('admin-approval');
            }}
            onNavigateToJobApproval={() => {
              setCurrentScreen('admin-job-approval');
            }}
            onPostJob={() => {
              setCurrentScreen('post-job');
            }}
            onNavigateToJobHistory={() => {
              setCurrentScreen('admin-job-history');
            }}
            onSendReminders={async () => {
              try {
                const result = await triggerDeadlineReminders();
                if (result.emailsSent > 0) {
                  toast.success(`Sent ${result.emailsSent} reminder email(s)!`);
                } else {
                  toast.info(result.message || 'No reminders to send right now.');
                  if (result.debug) {
                    alert(`DEBUG INFO:\nJobs Found: ${result.debug.jobsFound}\nApplications Found: ${result.debug.applicationsFound}\nFailures: ${result.debug.emailFailures.join(', ')}`);
                  }
                }
                return result;
              } catch (err: any) {
                toast.error('Failed to send reminders: ' + err.message);
                return { emailsSent: 0 };
              }
            }}
          />
        );

      case 'admin-job-approval':
        return (
          <AdminJobApprovalScreen
            jobs={jobAnnouncements}
            onBack={() => {
              setCurrentScreen('admin-trainer-approval');
            }}
            onApprove={handleApproveJob}
            onReject={handleRejectJob}
          />
        );

      case 'admin-job-history':
        return (
          <AdminJobHistoryScreen
            jobs={jobAnnouncements}
            onBack={() => setCurrentScreen('admin-trainer-approval')}
            onDeleteJob={handleDeleteJob}
            onUpdateJob={handleUpdateJob}
          />
        );

      case 'applied':
        return (
          <AppliedScreen
            appliedJobs={appliedJobs}
            onJobClick={handleJobClick}
            onWithdraw={handleWithdrawApplication}
            onBack={() => {
              setCurrentScreen('profile');
              setActiveTab('profile');
            }}
          />
        );

      case 'propose-course': { // Use block to isolate scope
        const jobForProposal = editingProposal
          ? jobAnnouncements.find(j => j.id === editingProposal.relatedJobId) || selectedJob
          : selectedJob;

        return jobForProposal ? (
          <CourseProposalForm
            job={jobForProposal}
            trainerName={userName}
            trainerEmail={userEmail}
            initialData={editingProposal || undefined}
            onClose={() => {
              setCurrentScreen(editingProposal ? 'trainer-dashboard' : 'job-detail');
              setEditingProposal(null);
            }}
            onSubmit={async (proposal) => {
              try {
                const saved = await saveProposal(proposal);
                if (editingProposal) {
                  setCourseProposals(courseProposals.map(p => p.id === saved.id ? saved : p));
                  toast.success('Course proposal updated successfully!');
                } else {
                  setCourseProposals([saved, ...courseProposals]);
                  toast.success('Course proposal submitted for review!');
                }
                setEditingProposal(null);
                setCurrentScreen('trainer-dashboard');
              } catch (err: any) { toast.error('Error: ' + err.message); }
            }}
          />
        ) : null;
      }

      case 'trainer-browse-jobs':
        return (
          <TrainerJobBrowseScreen
            jobs={approvedJobs}
            onJobClick={handleJobClick}
            onBack={() => {
              setCurrentScreen('trainer-dashboard');
            }}
          />
        );

      case 'trainer-application':
        return (
          <TrainerApplicationForm
            isSignupMode={true}
            onBack={() => {
              setCurrentScreen('role-selection');
            }}
            onSubmit={async (application, signupData) => {
              try {
                if (signupData?.password) {
                  // Create the account first
                  await signUpUser(
                    application.email,
                    signupData.password,
                    application.name,
                    'trainer',
                    application.profession,
                    signupData.country || ''
                  );
                }

                // Submit to backend
                const saved = await submitTrainerApplication(application);
                setTrainerApplications([saved, ...trainerApplications]);
                // Automatically log them in testing bypass? Our API respects it 
                // We shouldn't automatically approve in production but preserving bypass logic
                setUserName(saved.name);
                setUserEmail(saved.email);
                setTrainerStatus(saved.status as TrainerStatus);
                toast.success('Trainer account created & application submitted!');
                setCurrentScreen('trainer-pending');
              } catch (err: any) { toast.error('Error: ' + err.message); }
            }}
          />
        );

      case 'trainer-pending':
        return (
          <TrainerPendingApprovalScreen
            trainerName={userName}
            trainerEmail={userEmail}
            status={trainerStatus}
            onBack={() => {
              handleLogout();
            }}
          />
        );

      case 'post-job':
        return (
          <PostJobForm
            userRole={userRole}
            userName={userName}
            userEmail={userEmail}
            onClose={() => {
              if (userRole === 'trainer') {
                setCurrentScreen('trainer-dashboard');
              } else if (userRole === 'admin') {
                setCurrentScreen('admin-trainer-approval');
              } else {
                setCurrentScreen('home');
                setActiveTab('home');
              }
            }}
            onSubmit={handlePostJob}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <MobileContainer>{renderScreen()}</MobileContainer>
    </>
  );
}