import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { MobileContainer } from './components/MobileContainer';
import { Onboarding } from './components/Onboarding';
import { LoginScreen, SignUpScreen } from './components/AuthScreens';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { CoursesScreen } from './components/CoursesScreen';
import { SavedScreen } from './components/SavedScreen';
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
import { CourseProposalForm } from './components/CourseProposalForm';
import { TrainerJobBrowseScreen } from './components/TrainerJobBrowseScreen';
import { PostJobForm } from './components/PostJobForm';
import { BottomNav } from './components/BottomNav';
import { mockJobAnnouncements, mockCourses, mockCourseProposals, mockEnrollments, mockTrainerApplications } from './mockData';
import { UserType, UserRole, JobAnnouncement, Course, CourseProposal, Enrollment, TrainerApplication, TrainerStatus } from './types';

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
  | 'post-job';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [userType, setUserType] = useState<UserType>('free');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [trainerStatus, setTrainerStatus] = useState<TrainerStatus>('pending');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobAnnouncement | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [jobAnnouncements, setJobAnnouncements] = useState<JobAnnouncement[]>(mockJobAnnouncements);
  const [courseProposals, setCourseProposals] = useState<CourseProposal[]>(mockCourseProposals);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [trainerApplications, setTrainerApplications] = useState<TrainerApplication[]>(mockTrainerApplications);

  // Only show approved jobs to regular users and trainers
  const approvedJobs = jobAnnouncements.filter(j => j.postStatus === 'approved');

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
    setUserName(userData.name);
    setUserEmail(userData.email);
    
    // If role is provided from login screen, set it
    if (userData.role) {
      setUserRole(userData.role);
    }
    
    const activeRole = userData.role || userRole;
    
    // Navigate based on role and trainer status
    if (activeRole === 'trainer') {
      // Check if trainer application exists and is approved
      const application = trainerApplications.find(app => app.email === userData.email);
      if (application) {
        if (application.status === 'approved') {
          setTrainerStatus('approved');
          setCurrentScreen('trainer-dashboard');
        } else {
          setTrainerStatus(application.status);
          setCurrentScreen('trainer-pending');
        }
      } else {
        setCurrentScreen('trainer-application');
      }
    } else if (activeRole === 'admin') {
      setCurrentScreen('admin-trainer-approval');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleSaveToggle = (id: string, type: 'job' | 'course') => {
    const prefixedId = `${type}:${id}`;
    setSavedItems((prev) =>
      prev.includes(prefixedId) ? prev.filter((item) => item !== prefixedId) : [...prev, prefixedId]
    );
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

  const handleLogout = () => {
    setCurrentScreen('onboarding');
    setUserType('free');
    setUserName('');
    setUserEmail('');
    setSavedItems([]);
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
    setCurrentScreen(screenMap[tab]);
  };

  const handleUpgradeClick = () => {
    setCurrentScreen('subscription');
  };

  const handlePostJob = (job: JobAnnouncement) => {
    setJobAnnouncements([...jobAnnouncements, job]);
    if (job.postStatus === 'approved') {
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
  };

  const handleApproveJob = (jobId: string) => {
    setJobAnnouncements(
      jobAnnouncements.map((j) =>
        j.id === jobId ? { ...j, postStatus: 'approved' as const, verified: true } : j
      )
    );
    toast.success('Job announcement approved and published!');
  };

  const handleRejectJob = (jobId: string, feedback: string) => {
    setJobAnnouncements(
      jobAnnouncements.map((j) =>
        j.id === jobId ? { ...j, postStatus: 'rejected' as const, adminFeedback: feedback } : j
      )
    );
    toast.info('Job announcement rejected with feedback sent to poster.');
  };

  const savedJobs = approvedJobs.filter((job) =>
    savedItems.includes(`job:${job.id}`)
  );
  const savedCourses = mockCourses.filter((course) =>
    savedItems.includes(`course:${course.id}`)
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
          />
        );

      case 'signup':
        return (
          <SignUpScreen
            onComplete={handleLoginComplete}
            onBack={() => setCurrentScreen('onboarding')}
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
              recommendedCourses={mockCourses.slice(0, 2)}
              onJobClick={handleJobClick}
              onCourseClick={handleCourseClick}
              onCategoryClick={(category) => {
                setActiveTab('explore');
                setCurrentScreen('explore');
              }}
              onUpgradeClick={handleUpgradeClick}
              onPostJob={() => setCurrentScreen('post-job')}
              onSeeAllJobs={() => {
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
              courses={mockCourses}
              onJobClick={handleJobClick}
              onCourseClick={handleCourseClick}
              onSaveToggle={handleSaveToggle}
              savedItems={savedItems}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'courses':
        return (
          <>
            <CoursesScreen
              courses={mockCourses}
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
              userProfession="Data Scientist"
              userType={userType}
              savedItemsCount={savedItems.length}
              onUpgrade={handleUpgradeClick}
              onLogout={handleLogout}
            />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        );

      case 'job-detail':
        return selectedJob ? (
          <JobDetailScreen
            job={selectedJob}
            userType={userType}
            userRole={userRole}
            relatedCourses={mockCourses.filter(c => c.relatedJobId === selectedJob.id)}
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
          />
        ) : null;

      case 'course-detail':
        return selectedCourse ? (
          <CourseDetailScreen
            course={selectedCourse}
            onBack={() => {
              setCurrentScreen(activeTab as Screen);
            }}
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
              setCurrentScreen('onboarding');
            }}
            onBrowseJobs={() => {
              setCurrentScreen('trainer-browse-jobs');
            }}
            onViewProposals={() => {
              // Could navigate to a detailed proposals screen
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
              setCurrentScreen('onboarding');
            }}
            onApprove={(proposalId) => {
              setCourseProposals(
                courseProposals.map((p) =>
                  p.id === proposalId ? { ...p, status: 'approved' as const } : p
                )
              );
              toast.success('Course proposal approved successfully!');
            }}
            onReject={(proposalId, feedback) => {
              setCourseProposals(
                courseProposals.map((p) =>
                  p.id === proposalId ? { ...p, status: 'rejected' as const, adminFeedback: feedback } : p
                )
              );
              toast.info('Course proposal rejected with feedback sent to trainer.');
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
            onApprove={(applicationId) => {
              setTrainerApplications(
                trainerApplications.map((app) =>
                  app.id === applicationId ? { ...app, status: 'approved' as const } : app
                )
              );
              toast.success('Trainer application approved successfully!');
            }}
            onReject={(applicationId, feedback) => {
              setTrainerApplications(
                trainerApplications.map((app) =>
                  app.id === applicationId ? { ...app, status: 'rejected' as const, adminFeedback: feedback } : app
                )
              );
              toast.info('Trainer application rejected with feedback sent to trainer.');
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

      case 'propose-course':
        return selectedJob ? (
          <CourseProposalForm
            job={selectedJob}
            trainerName={userName}
            trainerEmail={userEmail}
            onClose={() => {
              setCurrentScreen('job-detail');
            }}
            onSubmit={(proposal) => {
              setCourseProposals([...courseProposals, proposal]);
              toast.success('Course proposal submitted for review!');
              setCurrentScreen('trainer-dashboard');
            }}
          />
        ) : null;

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
            onBack={() => {
              setCurrentScreen('role-selection');
            }}
            onSubmit={(application) => {
              setTrainerApplications([...trainerApplications, application]);
              setUserName(application.name);
              setUserEmail(application.email);
              toast.success('Trainer application submitted for review!');
              setCurrentScreen('trainer-pending');
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