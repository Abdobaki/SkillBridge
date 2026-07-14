import React, { useState, useMemo } from 'react';
import { BookOpen, Star, Heart, Award, ArrowRight, ChevronLeft, ChevronRight, Filter, Languages, DollarSign, BarChart, Search } from 'lucide-react';
import { Course } from '../types';

interface CoursesViewProps {
  courses: Course[];
  savedCourseIds: string[];
  onToggleSaveCourse: (id: string) => void;
  onEnrollCourse: (id: string) => void;
}

export default function CoursesView({
  courses,
  savedCourseIds,
  onToggleSaveCourse,
  onEnrollCourse,
}: CoursesViewProps) {
  // Filters State
  const [activeTab, setActiveTab] = useState<'category' | 'level' | 'price' | 'language'>('category');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  // Apply filters state
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'All',
    level: 'All',
    language: 'All',
    maxPrice: 1000,
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      category: selectedCategory,
      level: selectedLevel,
      language: selectedLanguage,
      maxPrice: maxPrice,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedLanguage('All');
    setMaxPrice(1000);
    setSearchText('');
    setAppliedFilters({
      category: 'All',
      level: 'All',
      language: 'All',
      maxPrice: 1000,
    });
    setCurrentPage(1);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search text filter
      if (searchText.trim() !== '') {
        const query = searchText.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDescription = course.description.toLowerCase().includes(query);
        const matchesInstructor = course.instructor.toLowerCase().includes(query);
        const matchesCategory = course.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription && !matchesInstructor && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (appliedFilters.category !== 'All') {
        if (course.category !== appliedFilters.category) return false;
      }
      // Level filter
      if (appliedFilters.level !== 'All') {
        if (course.level !== appliedFilters.level) return false;
      }
      // Language filter
      if (appliedFilters.language !== 'All') {
        if (course.language !== appliedFilters.language) return false;
      }
      // Price filter
      if (course.price > appliedFilters.maxPrice) return false;

      return true;
    });
  }, [courses, appliedFilters, searchText]);

  // Pagination calculations (show 6 per page)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-5 pt-10 pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SideNavBar (Filters) */}
        <aside className="w-full lg:w-64 flex flex-col gap-6 sticky top-28 h-fit shrink-0">
          <div className="p-6 bg-white border border-outline-variant/30 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-1">Filters</h2>
            <p className="text-xs text-on-surface-variant font-medium mb-6">Customize your course search</p>
            
            {/* Filter Categories tab links */}
            <div className="space-y-2.5">
              <button 
                onClick={() => setActiveTab('category')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                  activeTab === 'category' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Category</span>
              </button>

              <button 
                onClick={() => setActiveTab('level')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                  activeTab === 'level' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <Award className="w-4 h-4 shrink-0" />
                <span>Skill Level</span>
              </button>

              <button 
                onClick={() => setActiveTab('price')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                  activeTab === 'price' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <DollarSign className="w-4 h-4 shrink-0" />
                <span>Price Limit</span>
              </button>

              <button 
                onClick={() => setActiveTab('language')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                  activeTab === 'language' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <Languages className="w-4 h-4 shrink-0" />
                <span>Language</span>
              </button>
            </div>

            {/* Expanded filter details based on selected parameter tab */}
            <div className="mt-6 pt-6 border-t border-outline-variant/20">
              {activeTab === 'category' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Select Category</p>
                  {['All', 'Software Development', 'Digital Design', 'Business Management', 'Data Science', 'Visual Production', 'Digital Marketing'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-primary focus:ring-primary/30"
                      />
                      <span className={`text-xs font-semibold ${selectedCategory === cat ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeTab === 'level' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Select Skill Level</p>
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer py-1">
                      <input 
                        type="radio" 
                        name="level"
                        checked={selectedLevel === lvl}
                        onChange={() => setSelectedLevel(lvl)}
                        className="w-4 h-4 text-primary focus:ring-primary/30"
                      />
                      <span className={`text-xs font-semibold ${selectedLevel === lvl ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{lvl}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeTab === 'price' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Max Price Limit</p>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs font-extrabold text-primary">
                    <span>100 SAR</span>
                    <span className="bg-primary/10 px-2 py-0.5 rounded-md">SAR {maxPrice}</span>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Select Language</p>
                  {['All', 'English', 'Arabic'].map(lang => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer py-1">
                      <input 
                        type="radio" 
                        name="language"
                        checked={selectedLanguage === lang}
                        onChange={() => setSelectedLanguage(lang)}
                        className="w-4 h-4 text-primary focus:ring-primary/30"
                      />
                      <span className={`text-xs font-semibold ${selectedLanguage === lang ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{lang}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <button 
                onClick={handleApplyFilters}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity hover:shadow-md"
              >
                Apply Filters
              </button>
              <button 
                onClick={handleResetFilters}
                className="w-full py-2.5 text-outline hover:text-primary rounded-xl font-bold text-xs transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Featured Course Hero banner */}
          <section className="relative overflow-hidden rounded-2xl bg-primary min-h-[380px] flex items-center group shadow-md">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuByAIHghDRfY40WBrKScoIhhdPthCh5XgH9L9D9R-MDYdRhlPfCgGfbCsbAk_4HkE4gEI2NFUVxIPoewRDkGVttkmbGazVXgG8eiBL_wiOfunTobxhBOrMZblKqfKFfmDGCSg9ZAfrQvs3pMCsGoNnnAi6VkwBucRldEiiR0xotDyupVkgb5gQ0MLEHwZ-2NQWFbdvH-dFXEa7bVdg1-1ezuqJceSaMzxUN4evMCG4NcMtC-xtewCq9" 
                alt="Strategic Leadership Course cover" 
                className="w-full h-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/75 to-transparent"></div>
            </div>
            
            <div className="relative z-10 w-full p-8 md:p-12 lg:w-4/5 xl:w-2/3">
              <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold mb-4 shadow-sm">
                Featured Course
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-primary mb-4 leading-tight">
                Strategic Leadership in the Digital Age: A Comprehensive Guide for Professionals
              </h1>
              <p className="text-on-primary/80 text-sm sm:text-base mb-8 max-w-xl font-medium leading-relaxed">
                Learn how to lead modern teams and achieve outstanding results in rapidly changing work environments using the latest global tools and methodologies.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <button 
                  onClick={() => onEnrollCourse('course-featured')}
                  className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-surface-container-low transition-all active:scale-95 duration-150 text-sm shadow-md"
                >
                  Enroll Now
                </button>
                <div className="flex items-center gap-2 text-on-primary text-xs sm:text-sm font-semibold">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">AS</span>
                  <span>Dr. Ahmed Al-Shamrani</span>
                </div>
              </div>
            </div>
          </section>

          {/* Courses Search Bar */}
          <div className="bg-white border border-outline-variant/30 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-outline">
                <Search className="w-4.5 h-4.5 text-on-surface-variant" />
              </div>
              <input 
                type="text" 
                placeholder="Search courses by title, instructor, description or category..." 
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-10 pr-10 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
              {searchText && (
                <button 
                  onClick={() => {
                    setSearchText('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-primary font-bold bg-surface-container p-1 rounded-full"
                >
                  ✕
                </button>
              )}
            </div>
            {searchText && (
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg whitespace-nowrap self-stretch sm:self-auto text-center">
                Found {filteredCourses.length} Matches
              </span>
            )}
          </div>

          {/* Grid Header */}
          <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">Explore All Courses</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Showing {filteredCourses.length} training courses based on your active criteria
              </p>
            </div>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Courses Grid */}
          {paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => {
                const isSaved = savedCourseIds.includes(course.id);
                return (
                  <div 
                    key={course.id} 
                    className="group bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button 
                        onClick={() => onToggleSaveCourse(course.id)}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur rounded-full text-on-surface-variant hover:text-red-500 transition-colors shadow-md"
                        title={isSaved ? "Remove from saved courses" : "Save course"}
                      >
                        <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-outline'}`} />
                      </button>
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold text-primary shadow-sm border border-outline-variant/10">
                        {course.hours} Hours
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-secondary text-[11px] font-bold uppercase tracking-wide">
                            {course.category}
                          </span>
                          <div className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{course.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-base text-primary mb-2 line-clamp-2 leading-snug group-hover:text-primary-container transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed font-medium">
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-outline-variant/20 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-outline-variant/25">
                            {course.instructorInitials}
                          </div>
                          <span className="text-xs font-semibold text-on-surface-variant truncate max-w-[100px]">
                            {course.instructor}
                          </span>
                        </div>
                        <span className="text-primary font-bold text-base">SAR {course.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed border-outline-variant/50 rounded-2xl text-center bg-white">
              <p className="font-bold text-lg text-primary mb-1">No courses match your filters</p>
              <p className="text-xs text-on-surface-variant mb-6 font-semibold">Try relaxing your limits or search keywords.</p>
              <button 
                onClick={handleResetFilters}
                className="px-5 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/40 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    currentPage === pageNum 
                      ? 'bg-primary text-on-primary shadow-md' 
                      : 'hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/40 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
