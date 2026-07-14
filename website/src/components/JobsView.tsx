import React, { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, Heart, Filter, CheckCircle2, ChevronDown, Award, Sparkles, Sliders } from 'lucide-react';
import { Job, FilterState } from '../types';

interface JobsViewProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  onToggleSaveJob: (id: string) => void;
  onApplyJob: (id: string) => void;
  initialSearchQuery: string;
  initialSearchLocation: string;
}

export default function JobsView({
  jobs,
  savedJobIds,
  appliedJobIds,
  onToggleSaveJob,
  onApplyJob,
  initialSearchQuery,
  initialSearchLocation,
}: JobsViewProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [jobTypes, setJobTypes] = useState({
    'Full-time': true,
    'Part-time': true,
    'Remote': true,
    'Contract': true,
  });
  const [salaryMax, setSalaryMax] = useState(50); // 50k DZD
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'All',
    jobTypes: { 'Full-time': true, 'Part-time': true, 'Remote': true, 'Contract': true },
    salaryMax: 50,
  });

  // Handle job type checkboxes
  const handleTypeChange = (type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract') => {
    setJobTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Run filtering
  const handleApplyFilters = () => {
    setAppliedFilters({
      category: selectedCategory,
      jobTypes: { ...jobTypes },
      salaryMax: salaryMax,
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search term filter (by title, company, or location)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Sidebar Category Filter
      if (appliedFilters.category !== 'All') {
        if (job.category !== appliedFilters.category) return false;
      }

      // Sidebar Job Type Filter
      const activeTypes = Object.entries(appliedFilters.jobTypes)
        .filter(([_, active]) => active)
        .map(([name]) => name);
      if (activeTypes.length > 0) {
        if (!activeTypes.includes(job.type)) return false;
      }

      // Sidebar Salary Filter (parsing salary range string e.g. "22k - 28k" or "10k - 12k")
      if (appliedFilters.salaryMax < 50) {
        // Extract the min salary number from string
        const matches = job.salary.match(/(\d+)/);
        if (matches) {
          const minVal = parseInt(matches[0], 10);
          if (minVal > appliedFilters.salaryMax) return false;
        }
      }

      return true;
    });
  }, [jobs, searchTerm, appliedFilters]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-5 py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex flex-col gap-5 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm h-fit lg:sticky lg:top-24">
        <div>
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 mb-1">
            <Sliders className="w-4.5 h-4.5 text-primary" /> Filters
          </h2>
          <p className="text-xs text-on-surface-variant font-medium">Refine your job matches</p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Category Filter */}
          <div>
            <span className="text-xs font-bold text-primary block mb-2 uppercase tracking-wide">Category</span>
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-xl text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:outline-none appearance-none font-semibold text-primary"
              >
                <option value="All">All Categories</option>
                <option value="Software Development">Software Dev</option>
                <option value="Design">Digital Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Job Type Filter */}
          <div>
            <span className="text-xs font-bold text-primary block mb-2.5 uppercase tracking-wide">Job Type</span>
            <div className="flex flex-col gap-2.5">
              {(['Full-time', 'Part-time', 'Remote', 'Contract'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={jobTypes[type]}
                    onChange={() => handleTypeChange(type)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 focus:ring-offset-0 focus:outline-none"
                  />
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <span className="text-xs font-bold text-primary block mb-2 uppercase tracking-wide">Max Starting Salary</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={salaryMax}
              onChange={(e) => setSalaryMax(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-xs font-bold text-on-surface-variant">
              <span>5k DZD</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-extrabold">
                {salaryMax === 50 ? 'Any' : `${salaryMax}k DZD`}
              </span>
              <span>50k+</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleApplyFilters}
          className="mt-6 w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all active:scale-95 hover:shadow-md"
        >
          Apply Filters
        </button>
      </aside>

      {/* Main Jobs Listing Area */}
      <section className="flex-1 flex flex-col gap-6">
        {/* Search & Headline */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Discover Your Next Opportunity
          </h1>
          <div className="relative w-full max-w-2xl shadow-sm rounded-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              placeholder="Search for jobs, companies, or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-10 bg-white border border-outline-variant/40 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-outline hover:text-primary font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Jobs List Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div 
                  key={job.id} 
                  className="bg-white border border-outline-variant/30 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                    {/* Logo */}
                    <div className="h-12 w-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 border border-outline-variant/10 overflow-hidden">
                      <img 
                        src={job.logo} 
                        alt={`${job.company} logo`} 
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    {/* Job Details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-base text-primary truncate max-w-[200px] md:max-w-[300px]">
                          {job.title}
                        </h3>
                        {job.verified && (
                          <span className="bg-mint-bg text-mint-text px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 border border-mint-text/20">
                            <CheckCircle2 className="w-3 h-3 fill-mint-text text-white" /> Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-outline" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-outline" /> {job.location}
                        </span>
                        <span className="bg-surface-container px-2 py-0.5 rounded-md text-[10px] text-primary">
                          {job.type}
                        </span>
                        <span className="text-primary font-bold">
                          DZD {job.salary} / month
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-outline-variant/25 sm:border-0 pt-3 sm:pt-0 shrink-0">
                    <button 
                      onClick={() => onToggleSaveJob(job.id)}
                      className="p-2.5 rounded-full hover:bg-red-50 text-outline hover:text-red-500 transition-colors"
                      title={isSaved ? "Remove from favorites" : "Save to favorites"}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-outline'}`} />
                    </button>
                    <button 
                      onClick={() => onApplyJob(job.id)}
                      disabled={isApplied}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shrink-0 ${
                        isApplied 
                          ? 'bg-mint-bg text-mint-text border border-mint-text/35 cursor-not-allowed'
                          : 'bg-primary text-on-primary hover:bg-primary-container hover:shadow-md'
                      }`}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-8 p-12 border-2 border-dashed border-outline-variant/60 rounded-2xl flex flex-col items-center justify-center text-center bg-white shadow-inner">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="font-bold text-lg text-primary mb-1">Couldn't find what you're looking for?</p>
            <p className="text-xs text-on-surface-variant max-w-sm mb-6 font-medium">
              Try changing the filters, adjust the salary slider, or check your search keywords.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setJobTypes({ 'Full-time': true, 'Part-time': true, 'Remote': true, 'Contract': true });
                setSalaryMax(50);
                setAppliedFilters({ category: 'All', jobTypes: { 'Full-time': true, 'Part-time': true, 'Remote': true, 'Contract': true }, salaryMax: 50 });
              }}
              className="px-5 py-2.5 bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary rounded-xl text-xs font-bold transition-all border border-outline-variant/20"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
