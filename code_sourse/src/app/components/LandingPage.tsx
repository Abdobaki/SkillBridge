import { useState, useEffect, useRef } from 'react';
import { Briefcase, GraduationCap, Crown, Users, BookOpen, Shield, ChevronRight, ArrowRight, Smartphone, Globe, Star, TrendingUp, CheckCircle, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let animationFrame: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  return count;
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const statsRef = useInView(0.3);
  const jobsCount = useCountUp(2500, 2000, statsRef.inView);
  const coursesCount = useCountUp(150, 2000, statsRef.inView);
  const usersCount = useCountUp(10000, 2000, statsRef.inView);
  const trainersCount = useCountUp(300, 2000, statsRef.inView);

  const features = [
    {
      icon: Briefcase,
      title: 'Verified Job Opportunities',
      description: 'Access thousands of curated positions from trusted companies, research institutions, and government agencies — all verified by our team.',
      color: 'from-[#0B3C5D] to-[#1a5a8a]',
      iconColor: 'text-white',
    },
    {
      icon: GraduationCap,
      title: 'Expert-Led Courses',
      description: 'Upskill with industry professionals. Our trainers are vetted experts who design courses that map directly to market demands.',
      color: 'from-[#10B981] to-[#059669]',
      iconColor: 'text-white',
    },
    {
      icon: Shield,
      title: 'Admin-Verified Quality',
      description: 'Every job posting and course goes through an admin approval process, ensuring you only see legitimate, high-quality content.',
      color: 'from-[#F97316] to-[#ea580c]',
      iconColor: 'text-white',
    },
    {
      icon: Crown,
      title: 'Premium Insights',
      description: 'Upgrade to Premium for full salary details, priority applications, and exclusive course content from top trainers.',
      color: 'from-[#6366F1] to-[#4f46e5]',
      iconColor: 'text-white',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up as a job seeker, trainer, or both. Tell us about your skills and career goals.',
    },
    {
      number: '02',
      title: 'Explore Opportunities',
      description: 'Browse verified job announcements and doctoral positions filtered by your field. Save the ones that interest you.',
    },
    {
      number: '03',
      title: 'Upskill & Apply',
      description: 'Enroll in expert-led courses to bridge skill gaps, then apply directly — all from one platform.',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3C5D] to-[#10B981] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">SkillBridge</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
            <a href="#download" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Download</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={onLogin} className="text-foreground">
              Login
            </Button>
            <Button onClick={onGetStarted} className="bg-[#0B3C5D] text-white hover:bg-[#0B3C5D]/90">
              Get Started
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border px-6 pb-6 space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground">How It Works</a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground">Impact</a>
            <a href="#download" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground">Download</a>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onLogin} className="flex-1">Login</Button>
              <Button onClick={onGetStarted} className="flex-1 bg-[#0B3C5D] text-white">Get Started</Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-32 w-96 h-96 bg-[#0B3C5D]/5 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-32 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F97316]/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0B3C5D]/10 text-[#0B3C5D] px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>Trusted by thousands of professionals</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 tracking-tight">
              Bridge the Gap Between{' '}
              <span className="bg-gradient-to-r from-[#0B3C5D] via-[#10B981] to-[#0B3C5D] bg-clip-text text-transparent">
                Skills & Opportunity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Discover verified job announcements, upskill with expert-led courses, and connect with the right opportunities — all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={onGetStarted}
                className="w-full sm:w-auto h-14 px-8 text-base bg-[#0B3C5D] text-white hover:bg-[#0B3C5D]/90 rounded-xl shadow-lg shadow-[#0B3C5D]/20"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={onLogin}
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-base rounded-xl"
              >
                I Already Have an Account
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Admin-verified content</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span>Available on Android & Web</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 md:py-32 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-wider mb-3">Why SkillBridge</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Advance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From finding your next role to acquiring new skills, SkillBridge is the all-in-one platform designed for ambitious professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-card rounded-3xl p-8 border border-border hover:border-[#0B3C5D]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0B3C5D]/5 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#F97316] uppercase tracking-wider mb-3">Getting Started</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Three Steps to Your Next Move
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a job seeker, a trainer, or a recruiter — SkillBridge makes it simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="relative z-10 bg-card rounded-3xl p-8 border border-border hover:border-[#10B981]/30 transition-all duration-300">
                  <div className="text-5xl font-bold text-[#0B3C5D]/10 mb-4">{step.number}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section id="stats" className="py-20 md:py-32 px-6 bg-gradient-to-br from-[#0B3C5D] to-[#0a3050]" ref={statsRef.ref}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#10B981] uppercase tracking-wider mb-3">Our Impact</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Growing Every Day
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Join a thriving community of professionals, trainers, and organizations making their mark.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: jobsCount, suffix: '+', label: 'Job Announcements', icon: Briefcase },
              { value: coursesCount, suffix: '+', label: 'Expert Courses', icon: BookOpen },
              { value: usersCount, suffix: '+', label: 'Active Users', icon: Users },
              { value: trainersCount, suffix: '+', label: 'Verified Trainers', icon: GraduationCap },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10">
                  <Icon className="w-8 h-8 text-[#10B981] mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOR ROLES SECTION ── */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#6366F1] uppercase tracking-wider mb-3">Built For Everyone</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              One Platform, Multiple Roles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Job Seekers',
                description: 'Browse verified opportunities, apply with one tap, save positions, and track your applications — from internships to doctoral programs.',
                icon: Users,
                gradient: 'from-[#0B3C5D]/10 to-[#0B3C5D]/5',
                borderColor: 'hover:border-[#0B3C5D]/30',
              },
              {
                title: 'Trainers & Educators',
                description: 'Apply to become a verified trainer, propose courses linked to real job demands, and build your reputation while earning.',
                icon: GraduationCap,
                gradient: 'from-[#10B981]/10 to-[#10B981]/5',
                borderColor: 'hover:border-[#10B981]/30',
              },
              {
                title: 'Organizations',
                description: 'Post verified job announcements, reach a targeted pool of candidates, and connect with trainers to bridge your team\'s skill gaps.',
                icon: Shield,
                gradient: 'from-[#F97316]/10 to-[#F97316]/5',
                borderColor: 'hover:border-[#F97316]/30',
              },
            ].map((role, i) => {
              const Icon = role.icon;
              return (
                <div key={i} className={`bg-gradient-to-br ${role.gradient} rounded-3xl p-8 border border-border ${role.borderColor} transition-all duration-300`}>
                  <Icon className="w-12 h-12 text-foreground mb-6" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{role.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{role.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD / CTA SECTION ── */}
      <section id="download" className="py-20 md:py-32 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#0B3C5D] to-[#10B981] rounded-3xl p-10 md:p-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Bridge Your Future?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
                Join SkillBridge today — available on the web and as an Android app. Your next opportunity is one click away.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto h-14 px-8 text-base bg-white text-[#0B3C5D] hover:bg-white/90 rounded-xl font-semibold"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Sign Up on Web
                </Button>
                <a
                  href="https://github.com/Abdobaki/final-year-project-/releases/download/v1.0.0/SkillBridge-v1.0.0.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Download Android APK
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3C5D] to-[#10B981] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">SkillBridge</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="#download" className="hover:text-foreground transition-colors">Download</a>
            </div>

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
