import { JobAnnouncement, Course, User } from '../app/types';
import { UserPortfolio } from './portfolio-api';

export interface RecommendationResult<T> {
  item: T;
  score: number; // Percentage Match: 0 to 100
  matchedSkills: string[];
}

// Common stop words to exclude from keyword comparison
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't",
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing',
  "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't",
  'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself',
  'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is',
  "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should',
  "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we',
  "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
  "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would',
  "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
]);

function extractKeywords(text: string): string[] {
  if (!text) return [];
  // Split by non-word characters, convert to lowercase
  const words = text.toLowerCase().split(/[\s,\.\-\/\(\)\?\#\@\!]+/);
  // Filter out stop words, empty strings, and numbers
  return words.filter(word => 
    word.length > 2 && 
    !STOP_WORDS.has(word) && 
    isNaN(Number(word))
  );
}

// ----------------------------------------------------
// SCORING ENGINE
// ----------------------------------------------------

export function calculateJobMatchScore(
  user: User,
  portfolio: UserPortfolio | null,
  job: JobAnnouncement
): { score: number; matchedSkills: string[] } {
  // 1. Gather all candidate text assets
  const candidateTexts = [
    user.profession,
    user.bio || '',
  ];

  if (portfolio) {
    portfolio.experiences?.forEach(exp => {
      candidateTexts.push(exp.role);
      candidateTexts.push(exp.companyName);
      candidateTexts.push(exp.description || '');
    });

    portfolio.projects?.forEach(proj => {
      candidateTexts.push(proj.title);
      candidateTexts.push(proj.role || '');
      candidateTexts.push(proj.description || '');
    });
  }

  const candidateKeywords = new Set(extractKeywords(candidateTexts.join(' ')));

  // 2. Gather Job Requirements & Keywords
  const jobRequirements = job.requirements || [];
  const jobKeywords = extractKeywords(`${job.title} ${job.description} ${job.category}`);

  // 3. Find Matches
  const matchedSkills: string[] = [];
  
  // Direct check against job requirements list (usually holds skills like "React", "Python")
  jobRequirements.forEach(req => {
    const reqWords = extractKeywords(req);
    const hasOverlap = reqWords.some(word => candidateKeywords.has(word));
    if (hasOverlap && req.length < 30) {
      matchedSkills.push(req);
    }
  });

  // Calculate Overlap Score
  const jobKeywordSet = new Set(jobKeywords);
  let overlapCount = 0;
  
  jobKeywordSet.forEach(word => {
    if (candidateKeywords.has(word)) {
      overlapCount++;
    }
  });

  // Basic similarity percentage:
  // Math: 60% weight on requirements matches, 40% on overall description overlap
  const reqMatchScore = jobRequirements.length > 0
    ? (matchedSkills.length / jobRequirements.length) * 100
    : 100;

  const descMatchScore = jobKeywordSet.size > 0
    ? (overlapCount / jobKeywordSet.size) * 100
    : 100;

  let finalScore = Math.round((reqMatchScore * 0.6) + (descMatchScore * 0.4));
  
  // Bound score between 10% and 99% if at least something matches
  if (finalScore > 0) {
    finalScore = Math.max(15, Math.min(98, finalScore));
  } else {
    finalScore = 5; // Minimal baseline score
  }

  return {
    score: finalScore,
    matchedSkills: Array.from(new Set(matchedSkills))
  };
}

// Calculate course match (based on user profile gap or keywords overlap)
export function calculateCourseMatchScore(
  user: User,
  course: Course
): number {
  const candidateKeywords = new Set(extractKeywords(`${user.profession} ${user.bio || ''}`));
  const courseKeywords = extractKeywords(`${course.title} ${course.description} ${course.category}`);
  
  let matchCount = 0;
  courseKeywords.forEach(word => {
    if (candidateKeywords.has(word)) matchCount++;
  });

  const percentage = courseKeywords.length > 0 
    ? (matchCount / courseKeywords.length) * 100 
    : 100;

  return Math.max(10, Math.min(99, Math.round(percentage * 2))); // Boost match scaling
}

// ----------------------------------------------------
// BATCH UTILITIES
// ----------------------------------------------------

export function getRecommendedJobs(
  user: User,
  portfolio: UserPortfolio | null,
  jobs: JobAnnouncement[]
): RecommendationResult<JobAnnouncement>[] {
  return jobs
    .map(job => {
      const { score, matchedSkills } = calculateJobMatchScore(user, portfolio, job);
      return { item: job, score, matchedSkills };
    })
    .sort((a, b) => b.score - a.score);
}

export function getRecommendedCandidates(
  job: JobAnnouncement,
  candidates: { user: User; portfolio: UserPortfolio | null }[]
): RecommendationResult<{ user: User; portfolio: UserPortfolio | null }>[] {
  return candidates
    .map(candidate => {
      const { score, matchedSkills } = calculateJobMatchScore(
        candidate.user,
        candidate.portfolio,
        job
      );
      return { item: candidate, score, matchedSkills };
    })
    .sort((a, b) => b.score - a.score);
}
