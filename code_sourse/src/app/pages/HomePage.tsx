import { useNavigate } from 'react-router';
import { HomeScreen } from '../components/HomeScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { JobAnnouncement, Course } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const { userName, userType } = useAuthStore();
  const { jobAnnouncements, courses } = useDataStore();

  // Only show approved, non-expired jobs
  const approvedJobs = jobAnnouncements.filter((j) => {
    if (j.postStatus !== 'approved') return false;
    try {
      return new Date(j.applicationDeadline) >= new Date();
    } catch {
      return true;
    }
  });

  return (
    <HomeScreen
      userName={userName}
      userType={userType}
      featuredJobs={approvedJobs.slice(0, 3)}
      recommendedCourses={courses.slice(0, 2)}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onCourseClick={(course: Course) => navigate(`/course/${course.id}`)}
      onCategoryClick={(category: string) =>
        navigate(`/explore?category=${encodeURIComponent(category)}`)
      }
      onUpgradeClick={() => navigate('/subscription')}
      onPostJob={() => navigate('/post-job')}
      onSeeAllJobs={() => navigate('/explore')}
    />
  );
}
