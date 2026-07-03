import { create } from 'zustand';
import { UserType, UserRole, TrainerStatus } from '../types';

interface AuthState {
  // Auth status
  isAuthenticated: boolean;
  isInitializing: boolean;

  // User profile
  userId: string;
  userName: string;
  userEmail: string;
  userProfession: string;
  userCountry: string;
  userRole: UserRole;
  userType: UserType;
  trainerStatus: TrainerStatus;
  profileImage: string | undefined;

  // Actions
  setAuth: (data: Partial<AuthState>) => void;
  setInitializing: (val: boolean) => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  isInitializing: true,
  userId: '',
  userName: '',
  userEmail: '',
  userProfession: 'Professional',
  userCountry: '',
  userRole: 'user' as UserRole,
  userType: 'free' as UserType,
  trainerStatus: 'pending' as TrainerStatus,
  profileImage: undefined as string | undefined,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setAuth: (data) => set((state) => ({ ...state, ...data })),

  setInitializing: (val) => set({ isInitializing: val }),

  reset: () => set({ ...initialState, isInitializing: false }),
}));
