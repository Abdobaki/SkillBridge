export type UserType = 'free' | 'premium';
export type UserRole = 'user' | 'trainer' | 'admin';
export type CourseStatus = 'pending' | 'approved' | 'rejected' | 'active';
export type DeliveryMode = 'online' | 'hybrid' | 'onsite';
export type TrainerStatus = 'pending' | 'approved' | 'rejected';
export type JobPostStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  profession: string;
  country: string;
  subscriptionType: UserType;
  role: UserRole;
  profileImage?: string;
  trainerStatus?: TrainerStatus;
  cvFile?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface JobAnnouncement {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: 'job' | 'doctoral';
  category: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  posted: string;
  verified: boolean;
  logo?: string;
  postStatus: JobPostStatus;
  postedByRole: UserRole;
  postedByName: string;
  postedByEmail: string;
  adminFeedback?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorBio: string;
  instructorImage?: string;
  price: number;
  enrolled: number;
  thumbnail?: string;
  description: string;
  duration: string;
  category: string;
  verified: boolean;
  relatedJobId?: string;
  status?: CourseStatus;
  minEnrollment: number;
}

export interface CourseProposal {
  id: string;
  courseTitle: string;
  courseDescription: string;
  courseDescriptionFileName?: string;
  courseDescriptionFile?: string;
  skillsCovered: string[];
  duration: string;
  deliveryMode: DeliveryMode;
  basePrice: number;
  platformCommission: number;
  finalPrice: number;
  minStudents: number;
  maxStudents: number;
  startDate: string;
  coverImage?: string;
  instructorBio: string;
  experienceProof?: string;
  relatedJobId: string;
  relatedJobTitle: string;
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  status: CourseStatus;
  createdAt: string;
  adminFeedback?: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  enrolledDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
  progress: number;
}

export interface TrainerApplication {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profession: string;
  bio: string;
  cvFile: string;
  cvFileName: string;
  appliedDate: string;
  status: TrainerStatus;
  adminFeedback?: string;
}

export interface TrainerEarnings {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  courseEarnings: {
    courseId: string;
    courseTitle: string;
    students: number;
    revenue: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type PostType =
  | 'project'
  | 'portfolio'
  | 'certificate'
  | 'achievement'
  | 'internship'
  | 'job'
  | 'promotion'
  | 'announcement'
  | 'hackathon'
  | 'article'
  | 'advice'
  | 'question'
  | 'contribution'
  | 'general';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  size?: string;
  foundedDate?: string;
  socialLinks?: Record<string, string>;
  verified?: boolean;
  verificationType?: 'company' | 'startup' | 'none';
  createdAt?: string;
}

export interface Post {
  id: string;
  userId?: string;
  companyId?: string;
  content: string;
  mediaUrls: string[];
  attachmentUrls: string[];
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Joined relation metadata
  user?: {
    id: string;
    name: string;
    profileImage?: string;
    profession?: string;
    verified?: boolean;
  };
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
    verified?: boolean;
  };
  hasLiked?: boolean;
  hasSaved?: boolean;
  isFollowingAuthor?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  userId?: string;
  companyId?: string;
  content: string;
  parentId?: string;
  createdAt: string;
  
  // Joined relation metadata
  user?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  replies?: PostComment[];
}

export interface Follow {
  id: string;
  followerId: string;
  followingUserId?: string;
  followingCompanyId?: string;
  createdAt: string;
}