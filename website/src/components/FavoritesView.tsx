import React, { useState } from 'react';
import { Heart, MapPin, Briefcase, CheckCircle2, User, BookOpen, Clock, Rocket, Code, Brush, GraduationCap, Compass, Settings } from 'lucide-react';
import { Job, Course, UserProfile, ViewType } from '../types';

interface FavoritesViewProps {
  jobs: Job[];
  courses: Course[];
  savedJobIds: string[];
  savedCourseIds: string[];
  appliedJobIds: string[];
  onToggleSaveJob: (id: string) => void;
  onToggleSaveCourse: (id: string) => void;
  onApplyJob: (id: string) => void;
  onEnrollCourse: (id: string) => void;
  sarahProfile: UserProfile;
  setCurrentView: (view: ViewType) => void;
}

export default function FavoritesView({
  jobs,
  courses,
  savedJobIds,
  savedCourseIds,
  appliedJobIds,
  onToggleSaveJob,
  onToggleSaveCourse,
  onApplyJob,
  onEnrollCourse,
  sarahProfile,
  setCurrentView,
}: FavoritesViewProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses'>('jobs');

  // Filter list of jobs that are favorited/saved
  const savedJobs = jobs.filter(job => savedJobIds.includes(job.id));
  // Filter list of courses that are favorited/saved
  const savedCourses = courses.filter(course => savedCourseIds.includes(course.id));

  // Helper to render lucide icon for job categories
  const renderJobIcon = (title: string) => {
    if (title.toLowerCase().includes('ux') || title.toLowerCase().includes('creative') || title.toLowerCase().includes('director')) {
      return <Brush className="w-5 h-5 text-primary" />;
    }
    if (title.toLowerCase().includes('javascript') || title.toLowerCase().includes('developer')) {
      return <Code className="w-5 h-5 text-primary" />;
    }
    return <Rocket className="w-5 h-5 text-primary" />;
  };

  // Helper to render lucide icon for course categories
  const renderCourseIcon = (title: string) => {
    if (title.toLowerCase().includes('ui') || title.toLowerCase().includes('design')) {
      return <BookOpen className="w-5 h-5 text-primary" />;
    }
    return <GraduationCap className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-5 py-8 min-h-screen">
      {/* Profile Overview Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border border-outline-variant/45">
            <img 
              src={sarahProfile.avatar} 
              alt="Sarah Al-Ahmed headshot" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary mb-1">{sarahProfile.fullName}</h1>
            <p className="text-on-surface-variant text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary fill-mint-bg" />
              {sarahProfile.jobTitle} • {sarahProfile.location}
            </p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setCurrentView('settings')}
            className="px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-outline-variant/30">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 px-2 font-bold text-sm sm:text-base transition-all border-b-2 ${
              activeTab === 'jobs' 
                ? 'text-primary border-primary font-extrabold' 
                : 'text-on-surface-variant hover:text-primary border-transparent'
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`pb-4 px-2 font-bold text-sm sm:text-base transition-all border-b-2 ${
              activeTab === 'courses' 
                ? 'text-primary border-primary font-extrabold' 
                : 'text-on-surface-variant hover:text-primary border-transparent'
            }`}
          >
            Saved Courses ({savedCourses.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'jobs' ? (
        <div className="space-y-4">
          {savedJobs.length > 0 ? (
            savedJobs.map(job => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary shrink-0">
                      {renderJobIcon(job.title)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-primary group-hover:text-primary-container transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-xs font-semibold text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-outline" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-outline" /> {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-outline-variant/20 pt-3 md:pt-0 shrink-0">
                    <span className="bg-mint-bg text-mint-text px-3 py-1 rounded-lg text-xs font-extrabold border border-mint-text/20">
                      {job.type}
                    </span>
                    <button 
                      onClick={() => onToggleSaveJob(job.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-red-500" />
                    </button>
                    <button 
                      onClick={() => onApplyJob(job.id)}
                      disabled={isApplied}
                      className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shrink-0 ${
                        isApplied 
                          ? 'bg-mint-bg text-mint-text border border-mint-text/30 cursor-not-allowed'
                          : 'bg-primary text-on-primary hover:bg-primary-container shadow-sm'
                      }`}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 border-2 border-dashed border-outline-variant/50 rounded-2xl text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mx-auto mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="font-bold text-primary mb-1">No saved jobs yet</p>
              <p className="text-xs text-on-surface-variant mb-4 font-semibold">Browse active openings and save them to your bookmarks.</p>
              <button 
                onClick={() => setCurrentView('jobs')}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs"
              >
                Find Jobs
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {savedCourses.length > 0 ? (
            savedCourses.map(course => (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary shrink-0">
                    {renderCourseIcon(course.title)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-primary group-hover:text-primary-container transition-colors">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-xs font-semibold text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-outline" /> {course.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-outline" /> {course.hours} Learning Hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-outline-variant/20 pt-3 md:pt-0 shrink-0">
                  <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-lg text-xs font-extrabold border border-outline-variant/25">
                    {course.level}
                  </span>
                  <button 
                    onClick={() => onToggleSaveCourse(course.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 fill-red-500" />
                  </button>
                  <button 
                    onClick={() => onEnrollCourse(course.id)}
                    className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm shrink-0"
                  >
                    Start Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 border-2 border-dashed border-outline-variant/50 rounded-2xl text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="font-bold text-primary mb-1">No saved courses yet</p>
              <p className="text-xs text-on-surface-variant mb-4 font-semibold">Explore expert syllabus tracks and save them to your learning list.</p>
              <button 
                onClick={() => setCurrentView('courses')}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs"
              >
                Explore Courses
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
