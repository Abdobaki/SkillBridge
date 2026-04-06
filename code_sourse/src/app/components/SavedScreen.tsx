import { Bookmark, Briefcase, BookOpen, Search } from 'lucide-react';
import { JobAnnouncement, Course } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useState } from 'react';

interface SavedScreenProps {
  savedJobs: JobAnnouncement[];
  savedCourses: Course[];
  onJobClick: (job: JobAnnouncement) => void;
  onCourseClick: (course: Course) => void;
  onUnsave: (id: string, type: 'job' | 'course') => void;
}

export function SavedScreen({
  savedJobs,
  savedCourses,
  onJobClick,
  onCourseClick,
  onUnsave,
}: SavedScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <h2 className="text-2xl text-foreground mb-4">Saved Items</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-input-background"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6 pt-4 border-b border-border">
          <TabsList className="w-full grid grid-cols-2 h-11">
            <TabsTrigger value="jobs">
              Jobs ({savedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="courses">
              Courses ({savedCourses.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jobs" className="flex-1 overflow-y-auto px-6 pt-4 pb-20 mt-0">
          {savedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
              <h4 className="text-foreground mb-2">No saved jobs</h4>
              <p className="text-sm text-muted-foreground text-center">
                Jobs you save will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground mb-1">{job.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {job.company}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onJobClick(job)}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => onUnsave(job.id, 'job')}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="flex-1 overflow-y-auto px-6 pt-4 pb-20 mt-0">
          {savedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
              <h4 className="text-foreground mb-2">No saved courses</h4>
              <p className="text-sm text-muted-foreground text-center">
                Courses you save will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
                >
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-foreground mb-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.instructor}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onCourseClick(course)}
                        variant="outline"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => onUnsave(course.id, 'course')}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}