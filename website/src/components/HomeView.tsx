import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Heart, Star, Briefcase, Terminal, Brush, BarChart2 } from 'lucide-react';
import { Job, Course, ViewType } from '../types';

interface HomeViewProps {
  jobs: Job[];
  courses: Course[];
  savedJobIds: string[];
  savedCourseIds: string[];
  appliedJobIds: string[];
  onToggleSaveJob: (id: string) => void;
  onToggleSaveCourse: (id: string) => void;
  onApplyJob: (id: string) => void;
  setCurrentView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  setSearchLocation: (loc: string) => void;
}

export default function HomeView({
  jobs,
  courses,
  savedJobIds,
  savedCourseIds,
  appliedJobIds,
  onToggleSaveJob,
  onToggleSaveCourse,
  onApplyJob,
  setCurrentView,
  setSearchQuery,
  setSearchLocation,
}: HomeViewProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [localLocation, setLocalLocation] = useState('');

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setSearchLocation(localLocation);
    setCurrentView('jobs');
  };

  // Get first 3 jobs as Featured Jobs
  const featuredJobs = jobs.slice(0, 3);
  // Get first 3 courses as Top Courses
  const topCourses = courses.slice(0, 3);

  // Helper to render lucide job category icon
  const renderJobIcon = (title: string) => {
    if (title.toLowerCase().includes('front-end') || title.toLowerCase().includes('developer')) {
      return <Terminal className="w-6 h-6 text-primary" />;
    }
    if (title.toLowerCase().includes('design') || title.toLowerCase().includes('ux')) {
      return <Brush className="w-6 h-6 text-primary" />;
    }
    return <BarChart2 className="w-6 h-6 text-primary" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden px-5">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mb-6 leading-tight max-w-4xl mx-auto">
            Elevate your career with <span className="text-primary-container bg-primary-fixed px-3 py-1 rounded-2xl">SkillBridge</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover thousands of curated jobs and training courses specifically designed for your professional future in one place.
          </p>

          {/* Interactive Unified Search Panel */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-4xl mx-auto bg-white p-2.5 rounded-2xl shadow-xl border border-outline-variant/30 flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-low/50 rounded-xl">
              <Search className="w-5 h-5 text-outline shrink-0" />
              <input 
                type="text" 
                placeholder="Job title or course..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-outline font-semibold"
              />
            </div>
            
            <div className="hidden md:block w-px h-8 bg-outline-variant/60 self-center"></div>

            <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-low/50 rounded-xl">
              <MapPin className="w-5 h-5 text-outline shrink-0" />
              <input 
                type="text" 
                placeholder="Location or 'Remote'..." 
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                className="w-full py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-outline font-semibold"
              />
            </div>

            <button 
              type="submit"
              className="bg-primary text-on-primary font-bold px-8 py-3.5 rounded-xl text-[15px] hover:bg-primary-container transition-all hover:shadow-lg active:scale-95 duration-150 whitespace-nowrap shrink-0"
            >
              Search Opportunities
            </button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-5 mb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Featured Jobs</h2>
            <p className="text-xs text-on-surface-variant">Top selected openings matching the highest skill levels</p>
          </div>
          <button 
            onClick={() => setCurrentView('jobs')}
            className="text-primary font-bold text-sm flex items-center gap-1.5 hover:underline group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = appliedJobIds.includes(job.id);
            return (
              <div 
                key={job.id} 
                className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                      {renderJobIcon(job.title)}
                    </div>
                    <button 
                      onClick={() => onToggleSaveJob(job.id)}
                      className="p-2 rounded-full bg-surface hover:bg-red-50 text-outline hover:text-red-500 transition-colors"
                      title={isSaved ? "Remove from favorites" : "Save to favorites"}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-outline'}`} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-primary-container transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-on-surface-variant font-medium text-sm mb-4">{job.company}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-outline" /> {job.location.split(',')[0]}
                    </span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-outline" /> {job.type}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => onApplyJob(job.id)}
                  disabled={isApplied}
                  className={`w-full font-bold text-sm py-3 rounded-xl transition-all active:scale-95 duration-150 ${
                    isApplied 
                      ? 'bg-mint-bg text-mint-text border border-mint-text/35 cursor-not-allowed'
                      : 'bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary'
                  }`}
                >
                  {isApplied ? 'Application Sent ✓' : 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Courses Section */}
      <section className="max-w-7xl mx-auto px-5 mt-12 mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Top Courses</h2>
            <p className="text-xs text-on-surface-variant">Expert-designed certification courses to fast-track your skills</p>
          </div>
          <button 
            onClick={() => setCurrentView('courses')}
            className="text-primary font-bold text-sm flex items-center gap-1.5 hover:underline group"
          >
            Explore Tracks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCourses.map((course) => {
            const isSaved = savedCourseIds.includes(course.id);
            return (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/25 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full bg-surface-container-high relative overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {course.bestseller && (
                      <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                        Bestseller
                      </div>
                    )}
                    <button 
                      onClick={() => onToggleSaveCourse(course.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur text-outline hover:text-red-500 transition-all shadow-md"
                      title={isSaved ? "Remove course from saved list" : "Save course"}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-outline'}`} />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2 line-clamp-1 group-hover:text-primary-container transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">DZD {course.price}</span>
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-semibold text-xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {course.rating} <span className="text-outline font-normal">({course.reviewCount})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
