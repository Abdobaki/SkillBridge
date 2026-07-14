import React, { useState } from 'react';
import { User, Mail, Briefcase, MapPin, Award, CheckCircle2, Star, Sparkles, BookOpen, Heart, Settings, ShieldCheck, FileText } from 'lucide-react';
import { UserProfile, ViewType } from '../types';

interface SettingsViewProps {
  alexProfile: UserProfile;
  setAlexProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  sarahProfile: UserProfile;
  setSarahProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeProfile: 'sarah' | 'alex';
  setActiveProfile: (profile: 'sarah' | 'alex') => void;
  savedJobCount: number;
  savedCourseCount: number;
  appliedJobCount: number;
  setCurrentView: (view: ViewType) => void;
}

export default function SettingsView({
  alexProfile,
  setAlexProfile,
  sarahProfile,
  setSarahProfile,
  activeProfile,
  setActiveProfile,
  savedJobCount,
  savedCourseCount,
  appliedJobCount,
  setCurrentView,
}: SettingsViewProps) {
  // Use the profile that is currently selected
  const activeProfileData = activeProfile === 'alex' ? alexProfile : sarahProfile;

  // Local Form state
  const [fullName, setFullName] = useState(activeProfileData.fullName);
  const [email, setEmail] = useState(activeProfileData.email);
  const [jobTitle, setJobTitle] = useState(activeProfileData.jobTitle);
  const [location, setLocation] = useState(activeProfileData.location);
  const [bio, setBio] = useState(activeProfileData.bio);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Synchronize when the active profile switches context
  React.useEffect(() => {
    setFullName(activeProfileData.fullName);
    setEmail(activeProfileData.email);
    setJobTitle(activeProfileData.jobTitle);
    setLocation(activeProfileData.location);
    setBio(activeProfileData.bio);
  }, [activeProfileData, activeProfile]);

  // Handle saving form info
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProfile: UserProfile = {
      ...activeProfileData,
      fullName,
      email,
      jobTitle,
      location,
      bio,
    };

    if (activeProfile === 'alex') {
      setAlexProfile(updatedProfile);
    } else {
      setSarahProfile(updatedProfile);
    }

    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
    }, 3000);
  };

  const toggleUpgradePro = () => {
    const updatedProfile: UserProfile = {
      ...activeProfileData,
      isPro: !activeProfileData.isPro,
    };
    if (activeProfile === 'alex') {
      setAlexProfile(updatedProfile);
    } else {
      setSarahProfile(updatedProfile);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-5 py-8">
      {/* Settings Header / Profile Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border border-outline-variant/40">
              <img 
                src={activeProfileData.avatar} 
                alt={`${activeProfileData.fullName} portrait`} 
                className="w-full h-full object-cover"
              />
            </div>
            {activeProfileData.verified && (
              <span className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-outline-variant/30">
                <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary-container" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-primary">{activeProfileData.fullName}</h1>
              {activeProfileData.isPro && (
                <span className="bg-amber-100 text-amber-700 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Pro Member
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-sm font-semibold mt-0.5">{activeProfileData.jobTitle}</p>
            <p className="text-outline text-xs mt-1 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {activeProfileData.location}
            </p>
          </div>
        </div>

        {/* Account context toggle helper for quick previewing */}
        <div className="bg-surface-container-low p-2 rounded-xl border border-outline-variant/25 flex items-center gap-1">
          <span className="text-xs text-outline font-bold px-2">Preview Account:</span>
          <button 
            onClick={() => setActiveProfile('sarah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeProfile === 'sarah' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Sarah
          </button>
          <button 
            onClick={() => setActiveProfile('alex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeProfile === 'alex' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Alex
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bento Grid Analytics & Premium Upgrade Banner (Left Col) */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-base font-bold text-primary tracking-tight">Account Overview</h2>
          
          {/* Bento Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Completed Courses */}
            <div 
              onClick={() => setCurrentView('courses')}
              className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm cursor-pointer hover:border-primary/20 transition-all flex flex-col justify-between"
            >
              <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[26px] font-extrabold text-primary leading-none mb-1">
                  {activeProfileData.coursesDone}
                </p>
                <p className="text-xs text-outline font-bold">Courses Done</p>
              </div>
            </div>

            {/* Card 2: Favorites Count */}
            <div 
              onClick={() => setCurrentView('favorites')}
              className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm cursor-pointer hover:border-primary/20 transition-all flex flex-col justify-between"
            >
              <div className="p-2.5 bg-red-50 text-red-500 w-fit rounded-xl mb-4">
                <Heart className="w-5 h-5 fill-red-100" />
              </div>
              <div>
                <p className="text-[26px] font-extrabold text-primary leading-none mb-1">
                  {activeProfile === 'sarah' ? (savedJobCount + savedCourseCount) : 4}
                </p>
                <p className="text-xs text-outline font-bold">Favorites</p>
              </div>
            </div>

            {/* Card 3: Applied Jobs Count */}
            <div 
              onClick={() => setCurrentView('jobs')}
              className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm cursor-pointer hover:border-primary/20 transition-all flex flex-col justify-between"
            >
              <div className="p-2.5 bg-mint-bg text-mint-text w-fit rounded-xl mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[26px] font-extrabold text-primary leading-none mb-1">
                  {activeProfileData.jobsApplied}
                </p>
                <p className="text-xs text-outline font-bold">Applied Openings</p>
              </div>
            </div>

            {/* Card 4: General Settings Link */}
            <div 
              className="bg-white p-5 rounded-2xl border border-outline-variant/30 shadow-sm cursor-pointer hover:border-primary/20 transition-all flex flex-col justify-between"
              onClick={() => alert("Already viewing account settings page.")}
            >
              <div className="p-2.5 bg-slate-100 text-slate-600 w-fit rounded-xl mb-4">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary mb-1">General Info</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Setup</p>
              </div>
            </div>
          </div>

          {/* Premium Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary p-6 shadow-md border border-white/10">
            {/* Ambient visual overlay */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-secondary/15 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-400 text-primary font-extrabold text-[10px] uppercase tracking-wider rounded-md mb-4 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-primary text-primary" /> Premium Pro
                </span>
                <h3 className="text-lg font-extrabold text-white mb-2 leading-snug">
                  Unlock Premium Access & Exclusive Careers
                </h3>
                <p className="text-on-primary/80 text-xs font-semibold leading-relaxed mb-6">
                  Get access to verified direct-recruitment pipelines, advanced AI career recommendations, and specialized learning modules.
                </p>
              </div>

              <button 
                onClick={toggleUpgradePro}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all duration-150 ${
                  activeProfileData.isPro 
                    ? 'bg-red-500/10 text-red-100 hover:bg-red-500/20 border border-red-500/30' 
                    : 'bg-white text-primary hover:bg-surface-container-low'
                }`}
              >
                {activeProfileData.isPro ? 'Cancel Pro Subscription' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Personal Information Form (Right 2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-outline-variant/30 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
            <div>
              <h2 className="text-lg font-bold text-primary">Personal Information</h2>
              <p className="text-xs text-on-surface-variant font-semibold">Update your account detail profile fields</p>
            </div>
            <User className="w-5 h-5 text-outline" />
          </div>

          {isSavedAlert && (
            <div className="mb-6 p-4 bg-mint-bg border border-mint-text/20 text-mint-text text-xs sm:text-sm font-extrabold rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 fill-mint-text text-white" />
              <span>Profile information has been updated and saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-outline">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-outline">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wide">Job Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-outline">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wide">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-outline">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wide">Biography</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-4 bg-surface-container-low/50 border border-outline-variant/30 rounded-xl text-sm font-semibold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                placeholder="Write a brief profile description about your career..."
              ></textarea>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
              <button 
                type="button"
                onClick={() => {
                  setFullName(activeProfileData.fullName);
                  setEmail(activeProfileData.email);
                  setJobTitle(activeProfileData.jobTitle);
                  setLocation(activeProfileData.location);
                  setBio(activeProfileData.bio);
                }}
                className="px-5 py-2.5 hover:bg-surface-container-low rounded-xl font-bold text-xs text-on-surface-variant transition-colors"
              >
                Reset
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-xs hover:opacity-90 hover:shadow-md transition-all active:scale-95 duration-150"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
