import React from 'react';
import { ViewType } from '../types';

interface FooterProps {
  setCurrentView: (view: ViewType) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  return (
    <footer className="border-t border-outline-variant/30 bg-surface-container-low/50 mt-12 mb-20 lg:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-center px-5 md:px-12 py-10 w-full max-w-7xl mx-auto gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span 
            className="text-xl font-bold text-primary cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            SkillBridge
          </span>
          <p className="text-xs text-on-surface-variant text-center md:text-left max-w-sm">
            Empowering professional growth through accessible education, world-class training courses, and targeted career opportunities.
          </p>
        </div>
        
        <div className="flex gap-8 text-sm text-on-surface-variant">
          <a href="#about" onClick={(e) => {e.preventDefault(); setCurrentView('home');}} className="hover:text-primary transition-colors underline decoration-outline-variant/50">About Us</a>
          <a href="#terms" onClick={(e) => {e.preventDefault();}} className="hover:text-primary transition-colors underline decoration-outline-variant/50">Terms</a>
          <a href="#privacy" onClick={(e) => {e.preventDefault();}} className="hover:text-primary transition-colors underline decoration-outline-variant/50">Privacy</a>
          <a href="#help" onClick={(e) => {e.preventDefault();}} className="hover:text-primary transition-colors underline decoration-outline-variant/50">Help</a>
        </div>
        
        <p className="text-xs text-on-surface-variant">
          © 2026 SkillBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
