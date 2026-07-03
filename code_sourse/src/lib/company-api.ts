import { supabase } from './supabase';
import { Company, User, JobAnnouncement, Post } from '../app/types';
import { toCamelCase, toSnakeCase } from './api';

// ----------------------------------------------------
// STORAGE ASSETS
// ----------------------------------------------------

export async function uploadCompanyAsset(
  companyId: string,
  file: File,
  type: 'logo' | 'cover'
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${companyId}-${type}-${Math.random()}.${fileExt}`;
  const filePath = `${type}s/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('company-assets')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('company-assets')
    .getPublicUrl(filePath);

  return publicUrl;
}

// ----------------------------------------------------
// COMPANY DETAILS CRUD
// ----------------------------------------------------

export async function fetchCompanyDetails(companyId: string): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (error) throw error;
  return toCamelCase(data) as Company;
}

export async function updateCompanyDetails(
  companyId: string,
  updates: Partial<Company>
): Promise<Company> {
  const payload = toSnakeCase(updates);
  const { data, error } = await supabase
    .from('companies')
    .update(payload)
    .eq('id', companyId)
    .select()
    .single();

  if (error) throw error;
  return toCamelCase(data) as Company;
}

export async function createCompany(company: Partial<Company>, ownerUserId: string): Promise<Company> {
  const payload = toSnakeCase(company);
  
  // Create company
  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .insert(payload)
    .select()
    .single();

  if (companyError) throw companyError;

  // Add owner to members table
  const { error: memberError } = await supabase
    .from('company_members')
    .insert({
      company_id: companyData.id,
      user_id: ownerUserId,
      role: 'owner',
    });

  if (memberError) {
    // Cleanup if member creation fails
    await supabase.from('companies').delete().eq('id', companyData.id);
    throw memberError;
  }

  return toCamelCase(companyData) as Company;
}

// ----------------------------------------------------
// MEMBERS & COLLABORATORS
// ----------------------------------------------------

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: 'owner' | 'admin' | 'recruiter';
  createdAt: string;
  user?: {
    name: string;
    email: string;
    profileImage?: string;
    profession?: string;
  };
}

export async function fetchCompanyMembers(companyId: string): Promise<CompanyMember[]> {
  const { data, error } = await supabase
    .from('company_members')
    .select(`
      *,
      user:users(*)
    `)
    .eq('company_id', companyId);

  if (error) throw error;
  return toCamelCase(data) as CompanyMember[];
}

export async function addCompanyMember(
  companyId: string,
  email: string,
  role: 'admin' | 'recruiter'
): Promise<CompanyMember> {
  // Find user by email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError) throw new Error('User not found with this email.');

  const { data, error } = await supabase
    .from('company_members')
    .insert({
      company_id: companyId,
      user_id: userData.id,
      role,
    })
    .select(`
      *,
      user:users(*)
    `)
    .single();

  if (error) throw error;
  return toCamelCase(data) as CompanyMember;
}

export async function removeCompanyMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('company_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
}

// ----------------------------------------------------
// RELATED RECRUITMENT & COMMUNITY ITEMS
// ----------------------------------------------------

export async function fetchCompanyJobs(companyId: string): Promise<JobAnnouncement[]> {
  const { data, error } = await supabase
    .from('job_announcements')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data) as JobAnnouncement[];
}

export async function fetchCompanyPosts(companyId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey(*),
      company:companies!posts_company_id_fkey(*)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCase(data) as Post[];
}
