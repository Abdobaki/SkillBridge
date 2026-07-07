import { supabase } from './supabase';
import { toCamelCase, toSnakeCase } from './api';
import { JobAnnouncement } from '../app/types';

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'applied' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
  
  // Joined relation metadata
  user?: {
    name: string;
    email: string;
    profileImage?: string;
    profession?: string;
  };
  job?: JobAnnouncement;
}

export interface Interview {
  id?: string;
  applicationId: string;
  title: string;
  description?: string;
  scheduledTime: string;
  meetingLink?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  createdAt?: string;
}

// ----------------------------------------------------
// RECRUITER OPERATIONS
// ----------------------------------------------------

export async function fetchJobApplicationsForRecruiter(jobId: string): Promise<JobApplication[]> {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      user:users!job_applications_user_id_fkey(*)
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data) as JobApplication[];
}

export async function updateJobApplicationStatus(
  applicationId: string,
  status: JobApplication['status']
): Promise<JobApplication> {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select(`
      *,
      user:users!job_applications_user_id_fkey(*)
    `)
    .single();

  if (error) throw error;
  return toCamelCase(data) as JobApplication;
}

// ----------------------------------------------------
// INTERVIEW SCHEDULING
// ----------------------------------------------------

export async function scheduleInterviewForCandidate(interview: Interview): Promise<Interview> {
  const payload = toSnakeCase(interview);
  const { data, error } = await supabase
    .from('interviews')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  // Optimistically update application status to 'interview_scheduled'
  await supabase
    .from('job_applications')
    .update({ 
      status: 'interview_scheduled',
      updated_at: new Date().toISOString()
    })
    .eq('id', interview.applicationId);

  return toCamelCase(data) as Interview;
}

export async function fetchInterviewsForApplication(applicationId: string): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('application_id', applicationId)
    .order('scheduled_time', { ascending: true });

  if (error) throw error;
  return toCamelCase(data) as Interview[];
}

// ----------------------------------------------------
// APPLICANT TRACKING
// ----------------------------------------------------

export interface UserApplicationDetail {
  id: string;
  jobId: string;
  status: JobApplication['status'];
  createdAt: string;
  job: JobAnnouncement;
}

export async function fetchUserApplicationsDetail(): Promise<UserApplicationDetail[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      id,
      job_id,
      status,
      created_at,
      job:job_announcements(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data) as UserApplicationDetail[];
}
