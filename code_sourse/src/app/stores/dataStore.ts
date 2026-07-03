import { create } from 'zustand';
import {
  JobAnnouncement,
  Course,
  CourseProposal,
  Enrollment,
  TrainerApplication,
} from '../types';

interface DataState {
  // Data collections
  jobAnnouncements: JobAnnouncement[];
  courses: Course[];
  courseProposals: CourseProposal[];
  enrollments: Enrollment[];
  trainerApplications: TrainerApplication[];
  appliedJobIds: string[];
  savedItems: string[];

  // Actions
  setJobs: (jobs: JobAnnouncement[]) => void;
  setCourses: (courses: Course[]) => void;
  setProposals: (proposals: CourseProposal[]) => void;
  setEnrollments: (enrollments: Enrollment[]) => void;
  setTrainerApplications: (apps: TrainerApplication[]) => void;
  setAppliedJobIds: (ids: string[]) => void;
  addAppliedJobId: (id: string) => void;
  removeAppliedJobId: (id: string) => void;
  setSavedItems: (items: string[]) => void;
  toggleSavedItem: (prefixedId: string) => void;

  // Job mutations
  addJob: (job: JobAnnouncement) => void;
  updateJob: (id: string, job: JobAnnouncement) => void;
  removeJob: (id: string) => void;

  // Course mutations
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;

  // Proposal mutations
  addProposal: (proposal: CourseProposal) => void;
  updateProposal: (id: string, proposal: CourseProposal) => void;

  // Enrollment mutations
  addEnrollment: (enrollment: Enrollment) => void;
  removeEnrollment: (id: string) => void;

  // Trainer application mutations
  addTrainerApplication: (app: TrainerApplication) => void;
  updateTrainerApplication: (id: string, app: TrainerApplication) => void;
}

// Load saved items from localStorage
function loadSavedItems(): string[] {
  try {
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const useDataStore = create<DataState>((set) => ({
  jobAnnouncements: [],
  courses: [],
  courseProposals: [],
  enrollments: [],
  trainerApplications: [],
  appliedJobIds: [],
  savedItems: loadSavedItems(),

  setJobs: (jobs) => set({ jobAnnouncements: jobs }),
  setCourses: (courses) => set({ courses }),
  setProposals: (proposals) => set({ courseProposals: proposals }),
  setEnrollments: (enrollments) => set({ enrollments }),
  setTrainerApplications: (apps) => set({ trainerApplications: apps }),
  setAppliedJobIds: (ids) => set({ appliedJobIds: ids }),
  addAppliedJobId: (id) =>
    set((state) => ({ appliedJobIds: [...state.appliedJobIds, id] })),
  removeAppliedJobId: (id) =>
    set((state) => ({
      appliedJobIds: state.appliedJobIds.filter((x) => x !== id),
    })),
  setSavedItems: (items) => {
    localStorage.setItem('savedItems', JSON.stringify(items));
    set({ savedItems: items });
  },
  toggleSavedItem: (prefixedId) =>
    set((state) => {
      const next = state.savedItems.includes(prefixedId)
        ? state.savedItems.filter((x) => x !== prefixedId)
        : [...state.savedItems, prefixedId];
      localStorage.setItem('savedItems', JSON.stringify(next));
      return { savedItems: next };
    }),

  // Job mutations
  addJob: (job) =>
    set((state) => ({ jobAnnouncements: [job, ...state.jobAnnouncements] })),
  updateJob: (id, job) =>
    set((state) => ({
      jobAnnouncements: state.jobAnnouncements.map((j) =>
        j.id === id ? job : j
      ),
    })),
  removeJob: (id) =>
    set((state) => ({
      jobAnnouncements: state.jobAnnouncements.filter((j) => j.id !== id),
    })),

  // Course mutations
  addCourse: (course) =>
    set((state) => ({ courses: [course, ...state.courses] })),
  updateCourse: (id, updates) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  // Proposal mutations
  addProposal: (proposal) =>
    set((state) => ({
      courseProposals: [proposal, ...state.courseProposals],
    })),
  updateProposal: (id, proposal) =>
    set((state) => ({
      courseProposals: state.courseProposals.map((p) =>
        p.id === id ? proposal : p
      ),
    })),

  // Enrollment mutations
  addEnrollment: (enrollment) =>
    set((state) => ({
      enrollments: [...state.enrollments, enrollment],
    })),
  removeEnrollment: (id) =>
    set((state) => ({
      enrollments: state.enrollments.filter((e) => e.id !== id),
    })),

  // Trainer application mutations
  addTrainerApplication: (app) =>
    set((state) => ({
      trainerApplications: [app, ...state.trainerApplications],
    })),
  updateTrainerApplication: (id, app) =>
    set((state) => ({
      trainerApplications: state.trainerApplications.map((a) =>
        a.id === id ? app : a
      ),
    })),
}));
