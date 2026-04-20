import { ArrowLeft, BookOpen, User, Users, Clock, CheckCircle2, TrendingUp, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Course } from '../types';

interface CourseDetailScreenProps {
  course: Course;
  onBack: () => void;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function CourseDetailScreen({ course, onBack, isSaved, onSaveToggle }: CourseDetailScreenProps) {
  const enrollmentPercentage = Math.min((course.enrolled / course.minEnrollment) * 100, 100);
  const hasMetMinimum = course.enrolled >= course.minEnrollment;
  const spotsNeeded = course.minEnrollment - course.enrolled;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        {onSaveToggle && (
          <button onClick={onSaveToggle} className="p-2 mb-4 rounded-lg hover:bg-muted transition-colors">
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-primary text-primary' : 'text-foreground'}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Course Thumbnail */}
        <div className="h-64 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 flex items-center justify-center">
          <BookOpen className="w-24 h-24 text-primary" />
        </div>

        <div className="px-6 py-6">
          {/* Title & Badges */}
          <div className="mb-6">
            <h1 className="text-2xl text-foreground mb-3">{course.title}</h1>
            <div className="flex items-center gap-2">
              {course.verified && (
                <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified Instructor
                </Badge>
              )}
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="secondary">{course.duration}</Badge>
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-card rounded-2xl p-5 border border-border mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-foreground mb-1">Instructor</h4>
                <p className="text-sm mb-2">{course.instructor}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {course.instructorBio}
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Status */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-2xl p-5 border border-accent/20 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-foreground">Enrollment Status</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {course.enrolled} enrolled (min {course.minEnrollment})
              </span>
            </div>

            <Progress value={enrollmentPercentage} className="mb-3" />

            <div className="flex items-center gap-2 text-sm">
              {hasMetMinimum ? (
                <>
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-accent">
                    Minimum enrollment met! Course is confirmed.
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-accent-orange" />
                  <span className="text-accent-orange">
                    {spotsNeeded} more student{spotsNeeded > 1 ? 's' : ''} needed to start
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <h3 className="text-foreground mb-3">About This Course</h3>
            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* What You'll Learn */}
          <div className="mb-6">
            <h3 className="text-foreground mb-3">What You'll Learn</h3>
            <ul className="space-y-3">
              {[
                'Hands-on practical projects with real-world applications',
                'Industry best practices and current methodologies',
                'Expert guidance and personalized feedback',
                'Certificate of completion for your professional portfolio',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Info */}
          <div className="bg-card rounded-2xl p-5 border border-border mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Course Fee</span>
              <span className="text-2xl text-foreground">€{course.price}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              *Platform fee included. Price per person.
            </p>
          </div>

          {/* Course Activation Notice */}
          {!hasMetMinimum && (
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
              <h4 className="text-foreground mb-2">Course Start Notice</h4>
              <p className="text-sm text-muted-foreground">
                This course will start once the minimum enrollment of {course.minEnrollment} students is reached. 
                Join now to secure your spot and receive updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
          >
            Contact Instructor
          </Button>
          <Button
            className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Join Course
          </Button>
        </div>
      </div>
    </div>
  );
}
