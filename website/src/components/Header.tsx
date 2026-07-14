import React, { useState } from 'react';
import { Bell, Search, ChevronDown, User, Heart, GraduationCap, Briefcase, Settings } from 'lucide-react';
import { ViewType, UserProfile } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  activeProfile: 'sarah' | 'alex';
  setActiveProfile: (profile: 'sarah' | 'alex') => void;
  sarahProfile: UserProfile;
  alexProfile: UserProfile;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  unreadNotificationsCount: number;
}

export default function Header({
  currentView,
  setCurrentView,
  activeProfile,
  setActiveProfile,
  sarahProfile,
  alexProfile,
  globalSearch,
  setGlobalSearch,
  unreadNotificationsCount,
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const currentProfileObj = activeProfile === 'sarah' ? sarahProfile : alexProfile;

  const handleNavClick = (view: ViewType, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView(view);
  };

  const toggleDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  const selectProfile = (prof: 'sarah' | 'alex') => {
    setActiveProfile(prof);
    setProfileDropdownOpen(false);
    // Automatically navigate to corresponding page to make the user experience superb
    if (prof === 'sarah') {
      setCurrentView('favorites');
    } else {
      setCurrentView('settings');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center w-full px-5 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-8 md:gap-12">
          <span 
            className="text-2xl font-extrabold text-primary cursor-pointer tracking-tight"
            onClick={() => setCurrentView('home')}
            id="brand-logo"
          >
            SkillBridge
          </span>
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <a 
              href="#jobs" 
              onClick={(e) => handleNavClick('jobs', e)}
              className={`font-sans text-[15px] font-semibold transition-colors pb-1 ${
                currentView === 'jobs' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Jobs
            </a>
            <a 
              href="#courses" 
              onClick={(e) => handleNavClick('courses', e)}
              className={`font-sans text-[15px] font-semibold transition-colors pb-1 ${
                currentView === 'courses' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Courses
            </a>
            <a 
              href="#explore" 
              onClick={(e) => handleNavClick('explore', e)}
              className={`font-sans text-[15px] font-semibold transition-colors pb-1 ${
                currentView === 'explore' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Explore
            </a>
            <a 
              href="#favorites" 
              onClick={(e) => handleNavClick('favorites', e)}
              className={`font-sans text-[15px] font-semibold transition-colors pb-1 ${
                currentView === 'favorites' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Favorites
            </a>
            <a 
              href="#download" 
              onClick={(e) => handleNavClick('download', e)}
              className={`font-sans text-[15px] font-semibold transition-colors pb-1 ${
                currentView === 'download' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Download
            </a>
          </nav>
        </div>

        {/* Global Search & Action Controls */}
        <div className="flex items-center gap-4">
          {/* Quick Search (Desktop) */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-outline">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search jobs or courses..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="h-10 pl-10 pr-4 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none w-48 lg:w-64 transition-all"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-primary font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Notifications button */}
          <button 
            onClick={() => setCurrentView('notifications')}
            className={`p-2 hover:bg-surface-container-low rounded-full transition-colors relative ${
              currentView === 'notifications' ? 'bg-surface-container-low' : ''
            }`}
            title="Notifications"
          >
            <Bell className={`w-5 h-5 ${currentView === 'notifications' ? 'text-primary stroke-[2.5]' : 'text-on-surface-variant'}`} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-secondary text-white text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Switching Menu */}
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="flex items-center gap-2 hover:bg-surface-container-low p-1.5 rounded-xl transition-all border border-outline-variant/25"
              id="profile-dropdown-btn"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0">
                <img 
                  src={currentProfileObj.avatar} 
                  alt={currentProfileObj.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden lg:inline text-sm font-semibold text-primary truncate max-w-[100px]">
                {currentProfileObj.fullName.split(' ')[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-outline" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-outline-variant/30">
                  <p className="text-[11px] font-bold text-outline uppercase tracking-wider">Active Account Context</p>
                  <p className="text-sm font-bold text-primary truncate">{currentProfileObj.fullName}</p>
                  <p className="text-xs text-on-surface-variant truncate">{currentProfileObj.jobTitle}</p>
                </div>
                
                <button 
                  onClick={() => selectProfile('sarah')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    activeProfile === 'sarah' 
                      ? 'bg-surface-container-low text-primary font-semibold' 
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-outline-variant">
                    <img src={sarahProfile.avatar} alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold">Sarah Al-Ahmed</p>
                    <p className="text-[10px] text-outline truncate">Favorites Layout Context</p>
                  </div>
                </button>

                <button 
                  onClick={() => selectProfile('alex')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    activeProfile === 'alex' 
                      ? 'bg-surface-container-low text-primary font-semibold' 
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-outline-variant">
                    <img src={alexProfile.avatar} alt="Alex" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold">Alex Rivera</p>
                    <p className="text-[10px] text-outline truncate">Settings Layout Context</p>
                  </div>
                </button>

                <div className="border-t border-outline-variant/30 mt-2 pt-1">
                  <button 
                    onClick={() => { setCurrentView('favorites'); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" /> Saved Favorites
                  </button>
                  <button 
                    onClick={() => { setCurrentView('settings'); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" /> Profile & Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
