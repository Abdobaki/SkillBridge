import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Briefcase, BookOpen, Bookmark, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { JobAnnouncement, Course } from '../types';

interface ExploreScreenProps {
  jobs: JobAnnouncement[];
  courses: Course[];
  onJobClick: (job: JobAnnouncement) => void;
  onCourseClick: (course: Course) => void;
  onSaveToggle: (id: string, type: 'job' | 'course') => void;
  savedItems: string[];
}

export function ExploreScreen({
  jobs,
  courses,
  onJobClick,
  onCourseClick,
  onSaveToggle,
  savedItems,
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <h2 className="text-2xl text-foreground mb-4">Explore</h2>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-input-background"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6 pt-4 border-b border-border">
          <TabsList className="w-full grid grid-cols-2 h-11">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="announcements" className="flex-1 overflow-y-auto px-6 pt-4 pb-20 mt-0">
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-2xl p-5 shadow-sm border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-7 h-7 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-foreground mb-1 line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                      <button
                        onClick={() => onSaveToggle(job.id, 'job')}
                        className="ml-2 p-1.5 rounded-lg hover:bg-muted"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            savedItems.includes(job.id)
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {job.verified && (
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0">
                          Verified
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {job.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{job.posted}</span>
                      </div>
                      <Button
                        onClick={() => onJobClick(job)}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="flex-1 overflow-y-auto px-6 pt-4 pb-20 mt-0">
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-foreground flex-1 line-clamp-2">
                      {course.title}
                    </h4>
                    <button
                      onClick={() => onSaveToggle(course.id, 'course')}
                      className="ml-2 p-1.5 rounded-lg hover:bg-muted"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          savedItems.includes(course.id)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    by {course.instructor}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {course.verified && (
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0">
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {course.duration}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary">€{course.price}</span>
                    <span className="text-xs text-muted-foreground">
                      {course.enrolled}/{course.maxEnrollment} enrolled
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{
                          width: `${(course.enrolled / course.maxEnrollment) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => onCourseClick(course)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    View Course
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}