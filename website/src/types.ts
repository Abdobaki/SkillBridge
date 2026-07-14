export type ViewType = 'home' | 'jobs' | 'courses' | 'favorites' | 'settings' | 'notifications' | 'explore' | 'download';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'application' | 'recommendation' | 'alert' | 'system';
  linkToView?: ViewType;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  salary: string;
  verified: boolean;
  logo: string;
  category: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  hours: number;
  rating: number;
  reviewCount: string;
  price: number;
  instructor: string;
  instructorInitials: string;
  image: string;
  bestseller?: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'English' | 'Arabic';
}

export interface UserProfile {
  fullName: string;
  email: string;
  jobTitle: string;
  location: string;
  bio: string;
  avatar: string;
  verified: boolean;
  coursesDone: number;
  jobsApplied: number;
  isPro: boolean;
}

export interface SavedState {
  savedJobIds: string[];
  savedCourseIds: string[];
  appliedJobIds: string[];
}

export interface FilterState {
  category: string;
  jobTypes: {
    'Full-time': boolean;
    'Part-time': boolean;
    'Remote': boolean;
  };
  salaryMax: number; // in thousand SAR
  skillLevel: string;
  priceMax: number;
  language: string;
}
