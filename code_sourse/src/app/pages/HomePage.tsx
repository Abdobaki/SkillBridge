import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { HomeScreen } from '../components/HomeScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { JobAnnouncement, Course, User } from '../types';
import { fetchUserPortfolio, UserPortfolio } from '../../lib/portfolio-api';
import { getRecommendedJobs, calculateCourseMatchScore } from '../../lib/recommendation-api';

export function HomePage() {
  const navigate = useNavigate();
  const { userName, userType, userId, userEmail, userProfession, userRole } = useAuthStore();
  const { jobAnnouncements, courses } = useDataStore();
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function loadPortfolio() {
      try {
        const data = await fetchUserPortfolio(userId);
        setPortfolio(data);
      } catch {
        // ignore fallback
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [userId]);

  // Only show approved, non-expired jobs
  const approvedJobs = jobAnnouncements.filter((j) => {
    if (j.postStatus !== 'approved') return false;
    try {
      return new Date(j.applicationDeadline) >= new Date();
    } catch {
      return true;
    }
  });

  const currentUser: User = {
    id: userId,
    name: userName,
    email: userEmail,
    profession: userProfession,
    country: '',
    subscriptionType: userType,
    role: userRole,
    bio: ''
  };

  // Compute Job Recommendations
  const recommendedJobs = getRecommendedJobs(currentUser, portfolio, approvedJobs)
    .map(res => res.item)
    .slice(0, 3);

  // Compute Course Recommendations
  const recommendedCourses = [...courses]
    .sort((a, b) => calculateCourseMatchScore(currentUser, b) - calculateCourseMatchScore(currentUser, a))
    .slice(0, 2);

  return (
    <HomeScreen
      userName={userName}
      userType={userType}
      featuredJobs={recommendedJobs}
      recommendedCourses={recommendedCourses}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onCourseClick={(course: Course) => navigate(`/course/${course.id}`)}
      onCategoryClick={(category: string) =>
        navigate(`/explore?category=${encodeURIComponent(category)}`)
      }
      onUpgradeClick={() => navigate('/subscription')}
      onPostJob={() => navigate('/post-job')}
      onSeeAllJobs={() => navigate('/explore')}
      onChatsClick={() => navigate('/chats')}
    />
  );
}
