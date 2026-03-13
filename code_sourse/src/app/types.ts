export type UserType = 'free' | 'premium';
export type UserRole = 'user' | 'trainer' | 'admin';
export type CourseStatus = 'pending' | 'approved' | 'rejected' | 'active';
export type DeliveryMode = 'online' | 'hybrid' | 'onsite';
export type TrainerStatus = 'pending' | 'approved' | 'rejected';

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
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorBio: string;
  instructorImage?: string;
  price: number;
  enrolled: number;
  maxEnrollment: number;
  thumbnail?: string;
  description: string;
  duration: string;
  category: string;
  verified: boolean;
  relatedJobId?: string;
  status?: CourseStatus;
  minEnrollment?: number;
}

export interface CourseProposal {
  id: string;
  courseTitle: string;
  courseDescription: string;
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
  courseTitle: string;
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