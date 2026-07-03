import { supabase } from './supabase';
import { toCamelCase, toSnakeCase } from './api';

export interface PortfolioProject {
  id?: string;
  portfolioId?: string;
  title: string;
  description?: string;
  role?: string;
  technologies?: string[];
  projectUrl?: string;
  githubRepoUrl?: string;
  mediaUrls?: string[];
  displayOrder?: number;
}

export interface PortfolioExperience {
  id?: string;
  portfolioId?: string;
  companyName: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  displayOrder?: number;
}

export interface UserPortfolio {
  id: string;
  userId: string;
  githubUsername?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  layoutSettings?: Record<string, any>;
  projects?: PortfolioProject[];
  experiences?: PortfolioExperience[];
}

// ----------------------------------------------------
// PORTFOLIO METADATA CRUD
// ----------------------------------------------------

export async function fetchUserPortfolio(userId: string): Promise<UserPortfolio | null> {
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (portfolioError) throw portfolioError;
  if (!portfolio) return null;

  // Fetch joined projects and experiences
  const [projectsRes, experiencesRes] = await Promise.all([
    supabase.from('portfolio_projects').select('*').eq('portfolio_id', portfolio.id).order('display_order', { ascending: true }),
    supabase.from('portfolio_experiences').select('*').eq('portfolio_id', portfolio.id).order('display_order', { ascending: true })
  ]);

  return {
    ...toCamelCase(portfolio),
    projects: toCamelCase(projectsRes.data || []),
    experiences: toCamelCase(experiencesRes.data || [])
  } as UserPortfolio;
}

export async function createOrUpdatePortfolio(
  userId: string,
  updates: Partial<UserPortfolio>
): Promise<UserPortfolio> {
  const { id, projects, experiences, ...metaUpdates } = updates;
  const payload = toSnakeCase(metaUpdates);
  payload.user_id = userId;

  // Check if exists
  const { data: existing } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  let portfolioData;
  if (existing) {
    const { data, error } = await supabase
      .from('portfolios')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    portfolioData = data;
  } else {
    const { data, error } = await supabase
      .from('portfolios')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    portfolioData = data;
  }

  return toCamelCase(portfolioData) as UserPortfolio;
}

// ----------------------------------------------------
// TIMELINE EXPERIENCE
// ----------------------------------------------------

export async function savePortfolioExperience(
  portfolioId: string,
  experience: PortfolioExperience
): Promise<PortfolioExperience> {
  const payload = toSnakeCase(experience);
  payload.portfolio_id = portfolioId;

  if (experience.id) {
    const { data, error } = await supabase
      .from('portfolio_experiences')
      .update(payload)
      .eq('id', experience.id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data) as PortfolioExperience;
  } else {
    const { data, error } = await supabase
      .from('portfolio_experiences')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data) as PortfolioExperience;
  }
}

export async function deletePortfolioExperience(id: string): Promise<void> {
  const { error } = await supabase
    .from('portfolio_experiences')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ----------------------------------------------------
// PORTFOLIO PROJECTS
// ----------------------------------------------------

export async function savePortfolioProject(
  portfolioId: string,
  project: PortfolioProject
): Promise<PortfolioProject> {
  const payload = toSnakeCase(project);
  payload.portfolio_id = portfolioId;

  if (project.id) {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update(payload)
      .eq('id', project.id)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data) as PortfolioProject;
  } else {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return toCamelCase(data) as PortfolioProject;
  }
}

export async function deletePortfolioProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ----------------------------------------------------
// RESUME CV FILE UPLOADS
// ----------------------------------------------------

export async function uploadPortfolioCV(userId: string, file: File): Promise<string> {
  const fileName = `${userId}-cv-${Math.random()}.pdf`;
  const filePath = `cvs/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);

  return publicUrl;
}
