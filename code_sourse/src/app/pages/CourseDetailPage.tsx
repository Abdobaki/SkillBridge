import { useNavigate, useParams } from 'react-router';
import { CourseDetailScreen } from '../components/CourseDetailScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { MobileContainer } from '../components/MobileContainer';
import { joinCourse, leaveCourse } from '../../lib/api';

export function CourseDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { userEmail, userName, userRole } = useAuthStore();
  const {
    courses,
    savedItems,
    toggleSavedItem,
    enrollments,
    addEnrollment,
    removeEnrollment,
    updateCourse,
  } = useDataStore();

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Course not found.
        </div>
      </MobileContainer>
    );
  }

  const currentEnrollment =
    enrollments.find(
      (e) => e.courseId === course.id && e.studentEmail === userEmail
    ) || null;

  return (
    <CourseDetailScreen
      course={course}
      onBack={() => navigate(-1)}
      isSaved={savedItems.includes(`course:${course.id}`)}
      onSaveToggle={() => toggleSavedItem(`course:${course.id}`)}
      enrollment={currentEnrollment}
      onJoinCourse={async () => {
        const newEnrollment = await joinCourse(
          course.id,
          course.title,
          userName,
          userEmail
        );
        addEnrollment(newEnrollment);
        updateCourse(course.id, { enrolled: course.enrolled + 1 });
      }}
      onLeaveCourse={async () => {
        if (!currentEnrollment) return;
        await leaveCourse(currentEnrollment.id, course.id);
        removeEnrollment(currentEnrollment.id);
        updateCourse(course.id, {
          enrolled: Math.max(0, course.enrolled - 1),
        });
      }}
      onOpenChat={() => navigate(`/course/${course.id}/chat`)}
    />
  );
}
