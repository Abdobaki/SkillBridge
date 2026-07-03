import { useNavigate } from 'react-router';
import { SavedScreen } from '../components/SavedScreen';
import { useDataStore } from '../stores/dataStore';
import { JobAnnouncement, Course } from '../types';

export function SavedPage() {
  const navigate = useNavigate();
  const { jobAnnouncements, courses, savedItems, toggleSavedItem } =
    useDataStore();

  // All approved jobs (including expired) for saved items
  const allApprovedJobs = jobAnnouncements.filter(
    (j) => j.postStatus === 'approved'
  );
  const savedJobs = allApprovedJobs.filter((job) =>
    savedItems.includes(`job:${job.id}`)
  );
  const savedCourses = courses.filter((course) =>
    savedItems.includes(`course:${course.id}`)
  );

  return (
    <SavedScreen
      savedJobs={savedJobs}
      savedCourses={savedCourses}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onCourseClick={(course: Course) => navigate(`/course/${course.id}`)}
      onUnsave={(id: string, type: 'job' | 'course') =>
        toggleSavedItem(`${type}:${id}`)
      }
    />
  );
}
