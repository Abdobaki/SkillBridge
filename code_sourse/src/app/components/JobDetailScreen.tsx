import { ArrowLeft, MapPin, Briefcase, Calendar, Lock, CheckCircle2, AlertCircle, GraduationCap, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { JobAnnouncement, UserType, UserRole, Course } from '../types';

interface JobDetailScreenProps {
  job: JobAnnouncement;
  userType: UserType;
  userRole?: UserRole;
  relatedCourses?: Course[];
  onBack: () => void;
  onUpgrade: () => void;
  onProposeCourse?: () => void;
  onCourseClick?: (course: Course) => void;
}

export function JobDetailScreen({ 
  job, 
  userType, 
  userRole = 'user',
  relatedCourses = [],
  onBack, 
  onUpgrade,
  onProposeCourse,
  onCourseClick,
}: JobDetailScreenProps) {
  const isLocked = userType === 'free' && userRole !== 'trainer'; // Trainers can see everything
  const isTrainer = userRole === 'trainer';

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 py-6">
          {/* Company Logo */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>

          {/* Title & Company */}
          <div className="mb-4">
            <h1 className="text-2xl text-foreground mb-2">{job.title}</h1>
            <p className="text-lg text-muted-foreground">{job.company}</p>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-6">
            {job.verified && (
              <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            <Badge variant="secondary">{job.category}</Badge>
            <Badge variant="secondary">{job.type === 'doctoral' ? 'Doctoral' : 'Job'}</Badge>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 gap-4 mb-8 bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                <p className="text-foreground">{job.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Deadline</p>
                <p className="text-foreground">{job.applicationDeadline}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Salary</p>
                {isLocked ? (
                  <div className="flex items-center gap-2">
                    <div className="blur-sm select-none">€XX,XXX - €XX,XXX</div>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                ) : (
                  <p className="text-foreground">{job.salary || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-foreground mb-3">Description</h3>
            {isLocked ? (
              <div className="relative">
                <p className="text-muted-foreground leading-relaxed blur-sm select-none">
                  {job.description.substring(0, 150)}...
                </p>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Upgrade to view full details
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {job.description}
              </p>
            )}
          </div>

          {/* Requirements */}
          {!isLocked && (
            <div className="mb-8">
              <h3 className="text-foreground mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Courses Section */}
          {relatedCourses.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-foreground">Recommended Training for This Opportunity</h3>
              </div>
              <div className="space-y-3">
                {relatedCourses.map((course) => (
                  <div 
                    key={course.id} 
                    className="bg-card rounded-2xl p-4 border border-border cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => onCourseClick?.(course)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-foreground flex-1">{course.title}</h4>
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolled}/{course.maxEnrollment}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <span className="text-primary font-medium">€{course.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trainer Propose Course Button */}
          {isTrainer && onProposeCourse && (
            <div className="mb-8">
              <Button
                onClick={onProposeCourse}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Propose a Training Course for This Opportunity
              </Button>
            </div>
          )}

          {/* Notice for free users */}
          {isLocked && (
            <div className="bg-accent-orange/10 rounded-2xl p-5 border border-accent-orange/20 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-foreground mb-1">Premium Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Premium to view full job details, requirements, and application links.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
        {isLocked ? (
          <Button
            onClick={onUpgrade}
            className="w-full h-12 bg-accent-orange text-white hover:bg-accent-orange/90"
          >
            Upgrade to Premium
          </Button>
        ) : (
          <Button
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
}