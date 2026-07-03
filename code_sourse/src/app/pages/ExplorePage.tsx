import { useNavigate, useSearchParams } from 'react-router';
import { ExploreScreen } from '../components/ExploreScreen';
import { useDataStore } from '../stores/dataStore';
import { JobAnnouncement, Course } from '../types';

export function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobAnnouncements, courses, savedItems, toggleSavedItem } =
    useDataStore();

  const initialCategory = searchParams.get('category') || null;

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
    <ExploreScreen
      jobs={approvedJobs}
      courses={courses}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onCourseClick={(course: Course) => navigate(`/course/${course.id}`)}
      onSaveToggle={(id: string, type: 'job' | 'course') =>
        toggleSavedItem(`${type}:${id}`)
      }
      savedItems={savedItems}
      initialCategory={initialCategory}
    />
  );
}
