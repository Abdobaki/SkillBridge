import { useNavigate, useParams } from 'react-router';
import { CourseChatScreen } from '../components/CourseChatScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { MobileContainer } from '../components/MobileContainer';

export function CourseChatPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { userEmail, userName, userRole } = useAuthStore();
  const { courses, enrollments } = useDataStore();

  const course = courses.find((c) => c.id === courseId);
  const enrolledInCourse = enrollments.filter(
    (e) => e.courseId === courseId
  ).length;

  if (!course) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Course not found.
        </div>
      </MobileContainer>
    );
  }

  return (
    <CourseChatScreen
      courseId={course.id}
      courseTitle={course.title}
      userEmail={userEmail}
      userName={userName}
      isInstructor={
        userRole === 'trainer' && course.instructor === userName
      }
      enrolledCount={enrolledInCourse}
      onBack={() => navigate(`/course/${course.id}`)}
    />
  );
}
