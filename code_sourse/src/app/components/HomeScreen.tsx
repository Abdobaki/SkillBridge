import { Bell, Crown, MapPin, Briefcase, Lock, ChevronRight, PlusCircle } from 'lucide-react';
import { UserType, JobAnnouncement, Course } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { categories } from '../mockData';
import * as Icons from 'lucide-react';

interface HomeScreenProps {
  userName: string;
  userType: UserType;
  featuredJobs: JobAnnouncement[];
  recommendedCourses: Course[];
  onJobClick: (job: JobAnnouncement) => void;
  onCourseClick: (course: Course) => void;
  onCategoryClick: (category: string) => void;
  onUpgradeClick: () => void;
  onPostJob?: () => void;
  onSeeAllJobs?: () => void;
}

export function HomeScreen({
  userName,
  userType,
  featuredJobs,
  recommendedCourses,
  onJobClick,
  onCourseClick,
  onCategoryClick,
  onUpgradeClick,
  onPostJob,
  onSeeAllJobs,
}: HomeScreenProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm mb-1">
              {greeting()}
            </p>
            <h2 className="text-primary-foreground text-xl">
              {userName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </button>
            {userType === 'premium' ? (
              <div className="flex items-center gap-2 bg-accent-orange/20 px-3 py-1.5 rounded-full">
                <Crown className="w-4 h-4 text-accent-orange" />
                <span className="text-xs text-primary-foreground">Premium</span>
              </div>
            ) : (
              <button
                onClick={onUpgradeClick}
                className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full hover:bg-primary-foreground/30"
              >
                <Crown className="w-4 h-4 text-primary-foreground" />
                <span className="text-xs text-primary-foreground">Free</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Post a Job CTA */}
      {onPostJob && (
        <div className="px-6 mt-4">
          <button
            onClick={onPostJob}
            className="w-full bg-gradient-to-r from-accent to-primary rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Post a Job Announcement</p>
              <p className="text-white/70 text-xs">Share opportunities with the community</p>
            </div>
          </button>
        </div>
      )}

      {/* Featured Announcements */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground">Featured Jobs</h3>
          <button onClick={onSeeAllJobs} className="text-primary text-sm">See All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="min-w-[280px] bg-card rounded-2xl p-5 shadow-sm border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                {job.verified && (
                  <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0">
                    Verified
                  </Badge>
                )}
              </div>

              <h4 className="text-foreground mb-1 line-clamp-1">{job.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {job.company}
              </p>

              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{job.location}</span>
              </div>

              {userType === 'free' ? (
                <div className="relative">
                  <div className="blur-sm select-none">
                    <p className="text-sm text-muted-foreground">€XX,XXX - €XX,XXX</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-accent mb-3">{job.salary}</p>
              )}

              <Button
                onClick={() => onJobClick(job)}
                variant="outline"
                className="w-full mt-3"
                size="sm"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground">Recommended Courses</h3>
          <button className="text-primary text-sm">See All</button>
        </div>

        <div className="space-y-4">
          {recommendedCourses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
              onClick={() => onCourseClick(course)}
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Icons.BookOpen className="w-12 h-12 text-primary" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-foreground flex-1 line-clamp-2">
                    {course.title}
                  </h4>
                  {course.verified && (
                    <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0 ml-2">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {course.instructor}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-primary">€{course.price}</span>
                  <div className="text-xs text-muted-foreground">
                    {course.enrolled} enrolled (min {course.minEnrollment})
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{
                        width: `${Math.min((course.enrolled / course.minEnrollment) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mt-8 mb-6">
        <h3 className="text-foreground mb-4">Browse by Category</h3>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => {
            const IconComponent = (Icons as any)[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.name)}
                className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                  {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                </div>
                <p className="text-xs text-center text-foreground line-clamp-2">
                  {category.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
