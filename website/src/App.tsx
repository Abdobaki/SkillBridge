import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import HomeView from './components/HomeView';
import JobsView from './components/JobsView';
import CoursesView from './components/CoursesView';
import FavoritesView from './components/FavoritesView';
import SettingsView from './components/SettingsView';
import NotificationsView from './components/Notifications';
import ExploreView from './components/Explore';
import DownloadView from './components/Download';
import { ViewType, UserProfile, Notification } from './types';
import { INITIAL_JOBS, INITIAL_COURSES, INITIAL_USER_PROFILES, INITIAL_NOTIFICATIONS } from './data';
import { CheckCircle2, Sparkles, X, Heart } from 'lucide-react';

export default function App() {
  // Global View Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('home');

  // Active Profile State Context
  const [activeProfile, setActiveProfile] = useState<'sarah' | 'alex'>('sarah');
  const [sarahProfile, setSarahProfile] = useState<UserProfile>(INITIAL_USER_PROFILES.sarah);
  const [alexProfile, setAlexProfile] = useState<UserProfile>(INITIAL_USER_PROFILES.alex);

  // Favorites / Bookmarks State
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1', 'job-5', 'job-6', 'job-7']);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(['course-1', 'course-10']);
  
  // Job Applications State
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-1', 'job-3']);

  // Course Enrollments State
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-1']);

  // Shared Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  // Toast Alerts Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'favorite' } | null>(null);

  // Notifications State Management
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared.', 'info');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted.', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'favorite' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Toggle saving a job to favorites
  const handleToggleSaveJob = (id: string) => {
    const jobObj = INITIAL_JOBS.find(j => j.id === id);
    const title = jobObj ? jobObj.title : 'Job';
    
    setSavedJobIds(prev => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        showToast(`Removed "${title}" from your bookmarks list.`, 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast(`Added "${title}" to your saved jobs!`, 'favorite');
        return [...prev, id];
      }
    });
  };

  // Toggle saving a course to favorites
  const handleToggleSaveCourse = (id: string) => {
    const courseObj = INITIAL_COURSES.find(c => c.id === id);
    const title = courseObj ? courseObj.title : 'Course';

    setSavedCourseIds(prev => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        showToast(`Removed "${title}" from your saved courses.`, 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast(`Added "${title}" to your learning tracks!`, 'favorite');
        return [...prev, id];
      }
    });
  };

  // Submit a job application
  const handleApplyJob = (id: string) => {
    const jobObj = INITIAL_JOBS.find(j => j.id === id);
    const title = jobObj ? jobObj.title : 'Job';

    if (appliedJobIds.includes(id)) return;

    setAppliedJobIds(prev => [...prev, id]);
    
    // Update active profile applied counts
    if (activeProfile === 'sarah') {
      setSarahProfile(prev => ({ ...prev, jobsApplied: prev.jobsApplied + 1 }));
    } else {
      setAlexProfile(prev => ({ ...prev, jobsApplied: prev.jobsApplied + 1 }));
    }

    // Add dynamic notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Application Received',
      message: `Your application for "${title}" has been successfully submitted. Recruiters will review your qualifications shortly.`,
      time: 'Just now',
      isRead: false,
      type: 'application',
      linkToView: 'favorites'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Successfully applied to ${title}! Recruiters will review your CV.`, 'success');
  };

  // Enroll in a course
  const handleEnrollCourse = (id: string) => {
    let title = 'Strategic Leadership';
    if (id !== 'course-featured') {
      const courseObj = INITIAL_COURSES.find(c => c.id === id);
      title = courseObj ? courseObj.title : 'Course';
    }

    if (!enrolledCourseIds.includes(id)) {
      setEnrolledCourseIds(prev => [...prev, id]);
    }

    // Update active profile completed courses count
    if (activeProfile === 'sarah') {
      setSarahProfile(prev => ({ ...prev, coursesDone: prev.coursesDone + 1 }));
    } else {
      setAlexProfile(prev => ({ ...prev, coursesDone: prev.coursesDone + 1 }));
    }

    // Add dynamic notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Enrolled in Course',
      message: `You have successfully enrolled in "${title}". Start watching the learning modules to build your certifications.`,
      time: 'Just now',
      isRead: false,
      type: 'recommendation',
      linkToView: 'courses'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Enrolled successfully in "${title}"! Begin your syllabus study.`, 'success');
  };

  // Render current view depending on route state
  const renderViewContent = () => {
    // If global search is set, override home page search
    const activeSearchQuery = globalSearch || searchQuery;

    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            jobs={INITIAL_JOBS}
            courses={INITIAL_COURSES}
            savedJobIds={savedJobIds}
            savedCourseIds={savedCourseIds}
            appliedJobIds={appliedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onToggleSaveCourse={handleToggleSaveCourse}
            onApplyJob={handleApplyJob}
            setCurrentView={setCurrentView}
            setSearchQuery={setSearchQuery}
            setSearchLocation={setSearchLocation}
          />
        );
      case 'jobs':
        return (
          <JobsView 
            jobs={INITIAL_JOBS}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onApplyJob={handleApplyJob}
            initialSearchQuery={activeSearchQuery}
            initialSearchLocation={searchLocation}
          />
        );
      case 'courses':
        return (
          <CoursesView 
            courses={INITIAL_COURSES}
            savedCourseIds={savedCourseIds}
            onToggleSaveCourse={handleToggleSaveCourse}
            onEnrollCourse={handleEnrollCourse}
          />
        );
      case 'favorites':
        return (
          <FavoritesView 
            jobs={INITIAL_JOBS}
            courses={INITIAL_COURSES}
            savedJobIds={savedJobIds}
            savedCourseIds={savedCourseIds}
            appliedJobIds={appliedJobIds}
            onToggleSaveJob={handleToggleSaveJob}
            onToggleSaveCourse={handleToggleSaveCourse}
            onApplyJob={handleApplyJob}
            onEnrollCourse={handleEnrollCourse}
            sarahProfile={sarahProfile}
            setCurrentView={setCurrentView}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            alexProfile={alexProfile}
            setAlexProfile={setAlexProfile}
            sarahProfile={sarahProfile}
            setSarahProfile={setSarahProfile}
            activeProfile={activeProfile}
            setActiveProfile={setActiveProfile}
            savedJobCount={savedJobIds.length}
            savedCourseCount={savedCourseIds.length}
            appliedJobCount={appliedJobIds.length}
            setCurrentView={setCurrentView}
          />
        );
      case 'notifications':
        return (
          <NotificationsView 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            onDeleteNotification={handleDeleteNotification}
            setCurrentView={setCurrentView}
          />
        );
      case 'explore':
        return (
          <ExploreView 
            jobs={INITIAL_JOBS}
            courses={INITIAL_COURSES}
            setCurrentView={setCurrentView}
            onEnrollCourse={handleEnrollCourse}
            onApplyJob={handleApplyJob}
            appliedJobIds={appliedJobIds}
            enrolledCourseIds={enrolledCourseIds}
          />
        );
      case 'download':
        return (
          <DownloadView 
            showToast={showToast}
          />
        );
      default:
        return <div className="text-center py-20 font-bold">404 - Section Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Dynamic Floating Toast Alerts */}
      {toast && (
        <div className="fixed bottom-24 sm:bottom-6 right-6 z-50 bg-white border border-outline-variant rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-sm animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="shrink-0">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-6 h-6 text-mint-text fill-mint-bg" />
            )}
            {toast.type === 'favorite' && (
              <Heart className="w-6 h-6 text-red-500 fill-red-100" />
            )}
            {toast.type === 'info' && (
              <Sparkles className="w-6 h-6 text-primary" />
            )}
          </div>
          <p className="text-xs sm:text-sm font-bold text-primary flex-1">
            {toast.message}
          </p>
          <button 
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-surface-container text-outline transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Desktop Layout Wrapper */}
      <div className="w-full">
        <Header 
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeProfile={activeProfile}
          setActiveProfile={setActiveProfile}
          sarahProfile={sarahProfile}
          alexProfile={alexProfile}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
        />
        
        {/* Main Render Section */}
        <main className="w-full">
          {renderViewContent()}
        </main>
      </div>

      {/* Global Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* Bottom Nav on Mobile devices */}
      <MobileNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}
