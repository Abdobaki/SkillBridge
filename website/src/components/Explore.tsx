import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Undo,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Job, Course, ViewType } from '../types';

interface ExploreViewProps {
  jobs: Job[];
  courses: Course[];
  setCurrentView: (view: ViewType) => void;
  onEnrollCourse: (id: string) => void;
  onApplyJob: (id: string) => void;
  appliedJobIds: string[];
  enrolledCourseIds: string[];
}

export default function ExploreView({
  jobs,
  courses,
  setCurrentView,
  onEnrollCourse,
  onApplyJob,
  appliedJobIds,
  enrolledCourseIds
}: ExploreViewProps) {
  // 1. Career Matchmaker state
  const [selectedRole, setSelectedRole] = useState<'software' | 'design' | 'marketing' | 'finance'>('software');

  // 2. Interactive Assessment Quiz state
  const [quizStep, setQuizStep] = useState<number>(0); // 0: intro, 1: focus, 2: skill, 3: objective, 4: results
  const [quizAnswers, setQuizAnswers] = useState({
    focus: '',
    skill: '',
    objective: ''
  });

  // Role recommendations configuration
  const roleData = {
    software: {
      title: 'Software Developer',
      skills: ['React.js', 'TypeScript', 'Node.js', 'SQL & Python'],
      growth: '+42% YoY Growth',
      avgSalary: '18k - 28k DZ',
      jobs: jobs.filter(j => j.category === 'Software Development' || j.title.toLowerCase().includes('developer')),
      courses: courses.filter(c => c.category === 'Software Development' || c.title.toLowerCase().includes('react') || c.title.toLowerCase().includes('ai'))
    },
    design: {
      title: 'UI/UX & Product Designer',
      skills: ['Figma UI Design', 'User Research', 'Wireframing', 'Visual Prototyping'],
      growth: '+35% YoY Growth',
      avgSalary: '15k - 25k DZ',
      jobs: jobs.filter(j => j.category === 'Design' || j.title.toLowerCase().includes('design')),
      courses: courses.filter(c => c.category === 'Digital Design' || c.title.toLowerCase().includes('ux') || c.title.toLowerCase().includes('design'))
    },
    marketing: {
      title: 'Digital Marketing & Growth Lead',
      skills: ['SEO/SEM', 'Google Analytics', 'Content Strategy', 'Social Campaigning'],
      growth: '+28% YoY Growth',
      avgSalary: '10k - 18k DZ',
      jobs: jobs.filter(j => j.category === 'Marketing' || j.title.toLowerCase().includes('marketing')),
      courses: courses.filter(c => c.category === 'Marketing' || c.title.toLowerCase().includes('digital') || c.title.toLowerCase().includes('fundamentals'))
    },
    finance: {
      title: 'Financial & Business Data Analyst',
      skills: ['Financial Analysis', 'Excel Pro', 'Data Visualization', 'SQL'],
      growth: '+31% YoY Growth',
      avgSalary: '14k - 22k DZ',
      jobs: jobs.filter(j => j.category === 'Finance' || j.title.toLowerCase().includes('analyst')),
      courses: courses.filter(c => c.category === 'Data Science' || c.title.toLowerCase().includes('science') || c.title.toLowerCase().includes('management'))
    }
  };

  // Handle Assessment Progress
  const startQuiz = () => {
    setQuizStep(1);
    setQuizAnswers({ focus: '', skill: '', objective: '' });
  };

  const handleSelectFocus = (focus: string) => {
    setQuizAnswers(prev => ({ ...prev, focus }));
    setQuizStep(2);
  };

  const handleSelectSkill = (skill: string) => {
    setQuizAnswers(prev => ({ ...prev, skill }));
    setQuizStep(3);
  };

  const handleSelectObjective = (objective: string) => {
    setQuizAnswers(prev => ({ ...prev, objective }));
    setQuizStep(4);
  };

  const getQuizRecommendation = () => {
    const { focus } = quizAnswers;
    if (focus === 'Tech') return roleData.software;
    if (focus === 'Creative') return roleData.design;
    if (focus === 'Analysis') return roleData.finance;
    return roleData.marketing;
  };

  const recommendedProfile = getQuizRecommendation();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-5 md:px-12 py-8 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-primary flex items-center justify-center sm:justify-start gap-3 tracking-tight mb-2">
          <Compass className="w-8 h-8 text-primary stroke-[2.5]" />
          Career Exploration Hub
        </h1>
        <p className="text-on-surface-variant text-base font-semibold max-w-2xl">
          Discover high-demand Middle East tech roles, take our smart career matchmaker quiz, and unlock customized paths containing top courses and live jobs.
        </p>
      </div>

      {/* Grid of Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-outline-variant/40 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-primary">35% Increase</h3>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mt-0.5">Profile Discoveries</p>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              Active certifications on profiles saw more interview invites from Msila & Alger tech firms.
            </p>
          </div>
        </div>

        <div className="bg-white border border-outline-variant/40 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-primary">Msila & Alger</h3>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mt-0.5">Top Hiring Zones</p>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              Highest density of local verified roles paying up to 45k DZ monthly for intermediate skills.
            </p>
          </div>
        </div>

        <div className="bg-white border border-outline-variant/40 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-primary">4,500+ Enrolled</h3>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mt-0.5">SkillBridge Alumni</p>
            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
              Engineers and creatives certified via accredited Arabic and English courses matching key roles.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Career Matchmaker & Interactive Path Explorer */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Matchmaker Panel */}
          <div className="bg-white border border-outline-variant/40 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div>
                <span className="text-[10px] font-extrabold text-secondary uppercase tracking-wider bg-secondary/10 px-2.5 py-1 rounded-full">
                  Interactive Guidance
                </span>
                <h2 className="text-xl font-extrabold text-primary mt-2">
                  Find Your Target Career
                </h2>
              </div>
              
              {/* Dynamic Badges selector */}
              <div className="flex bg-surface-container rounded-xl p-1 gap-1">
                {(['software', 'design', 'marketing', 'finance'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                      selectedRole === role 
                        ? 'bg-primary text-white shadow' 
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Role details box */}
            <div className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-primary">{roleData[selectedRole].title}</h3>
                  <p className="text-xs text-on-surface-variant">Recommended Career Specialization</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                    {roleData[selectedRole].growth}
                  </span>
                  <p className="text-xs text-outline font-semibold mt-1">Avg Salary: {roleData[selectedRole].avgSalary}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-2">Core Skills You'll Master:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {roleData[selectedRole].skills.map((skill, index) => (
                    <span key={index} className="bg-white text-primary text-xs font-semibold px-3 py-1 rounded-lg border border-outline-variant/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary stroke-[2.5]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Matched Courses for Selected Role */}
            <div className="mb-6">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary" />
                Accredited Skills Pathways ({roleData[selectedRole].courses.length})
              </h3>
              <div className="space-y-3">
                {roleData[selectedRole].courses.slice(0, 2).map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  return (
                    <div key={course.id} className="bg-white border border-outline-variant/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-outline-variant transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-primary">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-primary leading-tight">{course.title}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">Instructor: {course.instructor} • {course.hours} Hours</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onEnrollCourse(course.id)}
                        disabled={isEnrolled}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap self-start sm:self-center ${
                          isEnrolled 
                            ? 'bg-green-100 text-green-800 border border-green-200 cursor-default' 
                            : 'bg-primary text-white hover:opacity-90'
                        }`}
                      >
                        {isEnrolled ? 'Enrolled ✓' : 'Quick Enroll'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Matched Jobs for Selected Role */}
            <div>
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary" />
                Live Tailored Job Openings ({roleData[selectedRole].jobs.length})
              </h3>
              <div className="space-y-3">
                {roleData[selectedRole].jobs.slice(0, 2).map((job) => {
                  const hasApplied = appliedJobIds.includes(job.id);
                  return (
                    <div key={job.id} className="bg-white border border-outline-variant/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-outline-variant transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30 bg-surface-container">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-primary leading-tight">{job.title}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">{job.company} • {job.location} • {job.salary}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onApplyJob(job.id)}
                        disabled={hasApplied}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap self-start sm:self-center ${
                          hasApplied 
                            ? 'bg-secondary/15 text-secondary cursor-default' 
                            : 'border border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {hasApplied ? 'Applied ✓' : 'Instant Apply'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Featured Dynamic Section */}
          <div className="bg-gradient-to-br from-primary to-primary-variant text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Compass className="w-64 h-64 -mr-16 -mb-16" />
            </div>
            
            <div className="space-y-3 z-10 max-w-lg">
              <span className="bg-white/25 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full inline-block">
                SkillBridge Global Certifications
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">Accredited by Top Mena Employers</h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-semibold">
                Gain verified certifications accepted in Msila, Abu Dhabi, Jeddah, and Alger. Our dynamic standard guarantees 95% higher resume matching.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setCurrentView('courses')}
                  className="bg-white text-primary font-extrabold text-xs px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity inline-flex items-center gap-2"
                >
                  View All Certified Syllabus
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="shrink-0 z-10 grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center">
                <p className="text-2xl font-black">20+</p>
                <p className="text-[9px] text-white/70 uppercase font-bold tracking-wider mt-0.5">Sectors Supported</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center">
                <p className="text-2xl font-black">1.5 hr</p>
                <p className="text-[9px] text-white/70 uppercase font-bold tracking-wider mt-0.5">Response Time</p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive 3-Step Quiz */}
        <section className="space-y-8">
          
          {/* Quiz Container */}
          <div className="bg-white border border-outline-variant/40 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between h-full min-h-[480px]">
            {quizStep === 0 && (
              <div className="text-center py-6 flex-1 flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 stroke-[2]" />
                </div>
                <h3 className="text-xl font-extrabold text-primary mb-2">3-Step Path Matcher</h3>
                <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed mb-6 font-semibold">
                  Answer 3 quick questions about your career goals and we will synthesize an customized learning and job pathway for you.
                </p>
                <button
                  onClick={startQuiz}
                  className="w-full py-3 bg-primary text-white font-extrabold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Start Assessment
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

            {quizStep === 1 && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-outline font-bold mb-4">
                    <span>STEP 1 OF 3</span>
                    <span>FOCUS DOMAIN</span>
                  </div>
                  <h3 className="text-base font-extrabold text-primary mb-4 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                    Which field excites you the most?
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 'Tech', label: 'Tech & Software Engineering', desc: 'React, Node, databases, and AI coding.' },
                      { id: 'Creative', label: 'UI/UX & Creative Digital Design', desc: 'Figma, user experience maps, interface systems.' },
                      { id: 'Analysis', label: 'Business & Finance Data Analysis', desc: 'Syllabus analytics, Excel, business dashboards.' },
                      { id: 'Marketing', label: 'Digital Marketing & Growth', desc: 'Lead generation, campaign metrics, SEO.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectFocus(opt.id)}
                        className="w-full text-left p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low transition-all group"
                      >
                        <p className="text-xs sm:text-sm font-extrabold text-primary group-hover:text-primary transition-colors">{opt.label}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setQuizStep(0)}
                  className="mt-6 text-xs text-outline font-bold flex items-center gap-1.5 hover:text-primary self-start"
                >
                  <Undo className="w-3.5 h-3.5" /> Back to start
                </button>
              </div>
            )}

            {quizStep === 2 && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-outline font-bold mb-4">
                    <span>STEP 2 OF 3</span>
                    <span>EXPERIENCE LEVEL</span>
                  </div>
                  <h3 className="text-base font-extrabold text-primary mb-4 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                    What is your current experience level?
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 'beginner', label: 'Beginner / Career Switcher', desc: 'No professional experience in this target field.' },
                      { id: 'intermediate', label: 'Junior - Intermediate Practitioner', desc: '1 to 3 years, wanting to level up certifications.' },
                      { id: 'advanced', label: 'Senior Expert Developer / Lead', desc: '3+ years, looking for premium roles in Msila/Alger.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectSkill(opt.id)}
                        className="w-full text-left p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low transition-all group"
                      >
                        <p className="text-xs sm:text-sm font-extrabold text-primary group-hover:text-primary transition-colors">{opt.label}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setQuizStep(1)}
                  className="mt-6 text-xs text-outline font-bold flex items-center gap-1.5 hover:text-primary self-start"
                >
                  <Undo className="w-3.5 h-3.5" /> Back
                </button>
              </div>
            )}

            {quizStep === 3 && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-outline font-bold mb-4">
                    <span>STEP 3 OF 3</span>
                    <span>CAREER OBJECTIVE</span>
                  </div>
                  <h3 className="text-base font-extrabold text-primary mb-4 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                    What is your main priority?
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 'salary', label: 'Maximize Salary Potential', desc: 'Targeting highest-verified salaries in DZ.' },
                      { id: 'remote', label: 'Achieve Remote Flexibility', desc: 'Work from home or co-working zones.' },
                      { id: 'cert', label: 'Obtain Accredited Certifications', desc: 'Build a solid CV portfolio to impress top employers.' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectObjective(opt.id)}
                        className="w-full text-left p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low transition-all group"
                      >
                        <p className="text-xs sm:text-sm font-extrabold text-primary group-hover:text-primary transition-colors">{opt.label}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setQuizStep(2)}
                  className="mt-6 text-xs text-outline font-bold flex items-center gap-1.5 hover:text-primary self-start"
                >
                  <Undo className="w-3.5 h-3.5" /> Back
                </button>
              </div>
            )}

            {quizStep === 4 && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-outline font-bold mb-4">
                    <span>ASSESSMENT COMPLETE</span>
                    <span className="text-secondary font-black">100% MATCHED</span>
                  </div>
                  
                  <div className="text-center bg-secondary/10 border border-secondary/20 rounded-2xl p-4 mb-5">
                    <h4 className="text-xs text-secondary font-extrabold uppercase tracking-widest mb-1">Recommended Pathway</h4>
                    <p className="text-base font-black text-primary">{recommendedProfile.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1">Growth: {recommendedProfile.growth}</p>
                  </div>

                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Recommended Next Actions:</p>
                  <div className="space-y-3">
                    {recommendedProfile.courses[0] && (
                      <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] text-outline font-bold uppercase">Enroll in course</p>
                          <p className="text-xs font-extrabold text-primary truncate">{recommendedProfile.courses[0].title}</p>
                        </div>
                        <button
                          onClick={() => {
                            onEnrollCourse(recommendedProfile.courses[0].id);
                            setCurrentView('courses');
                          }}
                          className="px-2.5 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg whitespace-nowrap"
                        >
                          Enroll
                        </button>
                      </div>
                    )}

                    {recommendedProfile.jobs[0] && (
                      <div className="bg-surface-container p-3 rounded-xl flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] text-outline font-bold uppercase">Apply for job</p>
                          <p className="text-xs font-extrabold text-primary truncate">{recommendedProfile.jobs[0].title}</p>
                        </div>
                        <button
                          onClick={() => {
                            onApplyJob(recommendedProfile.jobs[0].id);
                            setCurrentView('jobs');
                          }}
                          className="px-2.5 py-1.5 border border-primary text-primary text-[11px] font-bold rounded-lg whitespace-nowrap hover:bg-primary hover:text-white"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => setQuizStep(1)}
                    className="flex-1 py-2 px-3 border border-outline hover:bg-surface-container text-primary font-bold text-xs rounded-xl"
                  >
                    Retake Quiz
                  </button>
                  <button 
                    onClick={() => setCurrentView('jobs')}
                    className="flex-1 py-2 px-3 bg-primary text-white font-bold text-xs rounded-xl"
                  >
                    Explore Jobs
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Sector Browser Grid */}
      <section className="mt-12 bg-white border border-outline-variant/40 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-primary mb-2">Explore Broad Industry Categories</h2>
        <p className="text-xs text-on-surface-variant font-semibold mb-6">Browse curated listings matching Middle Eastern market demands and professional certifications.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { cat: 'Software Development', count: jobs.filter(j => j.category === 'Software Development').length, color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
            { cat: 'Design', count: jobs.filter(j => j.category === 'Design').length, color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
            { cat: 'Marketing', count: jobs.filter(j => j.category === 'Marketing').length, color: 'bg-orange-50 border-orange-100 text-orange-700' },
            { cat: 'Finance', count: jobs.filter(j => j.category === 'Finance').length, color: 'bg-pink-50 border-pink-100 text-pink-700' }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => {
                // Navigate to jobs & trigger search or category
                setCurrentView('jobs');
              }}
              className="p-5 rounded-2xl border border-outline-variant/30 hover:border-primary cursor-pointer transition-all hover:shadow-md flex flex-col justify-between min-h-[140px] group"
            >
              <div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${item.color}`}>
                  {item.cat}
                </span>
                <h3 className="text-base font-extrabold text-primary mt-3 group-hover:text-secondary transition-colors">{item.cat} Careers</h3>
              </div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 font-semibold mt-4">
                {item.count} Active Openings
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
