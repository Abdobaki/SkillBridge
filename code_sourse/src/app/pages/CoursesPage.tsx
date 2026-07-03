import { useNavigate } from 'react-router';
import { CoursesScreen } from '../components/CoursesScreen';
import { useDataStore } from '../stores/dataStore';
import { Course } from '../types';

export function CoursesPage() {
  const navigate = useNavigate();
  const { courses, savedItems, toggleSavedItem } = useDataStore();

  return (
    <CoursesScreen
      courses={courses}
      onCourseClick={(course: Course) => navigate(`/course/${course.id}`)}
      onSaveToggle={(id: string, type: 'job' | 'course') =>
        toggleSavedItem(`${type}:${id}`)
      }
      savedItems={savedItems}
    />
  );
}
