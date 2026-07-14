import React from 'react';
import { Home, Search, BookOpen, Compass, Heart, User, Download } from 'lucide-react';
import { ViewType } from '../types';

interface MobileNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function MobileNav({ currentView, setCurrentView }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-3 lg:hidden bg-white shadow-lg border-t border-outline-variant/30 z-50 glass-effect">
      <button 
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'home' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">Home</span>
      </button>

      <button 
        onClick={() => setCurrentView('jobs')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'jobs' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <Search className={`w-5 h-5 ${currentView === 'jobs' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">Jobs</span>
      </button>

      <button 
        onClick={() => setCurrentView('courses')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'courses' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <BookOpen className={`w-5 h-5 ${currentView === 'courses' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">Courses</span>
      </button>

      <button 
        onClick={() => setCurrentView('explore')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'explore' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <Compass className={`w-5 h-5 ${currentView === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">Explore</span>
      </button>

      <button 
        onClick={() => setCurrentView('favorites')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'favorites' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">Favorites</span>
      </button>

      <button 
        onClick={() => setCurrentView('download')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'download' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <Download className={`w-5 h-5 ${currentView === 'download' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">App</span>
      </button>

      <button 
        onClick={() => setCurrentView('settings')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'settings' ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant'
        }`}
      >
        <User className={`w-5 h-5 ${currentView === 'settings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-1">Account</span>
      </button>
    </nav>
  );
}
