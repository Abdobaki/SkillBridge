import { Search, BookOpen, SlidersHorizontal, TrendingUp, Clock } from 'lucide-react';
import { Course } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface CoursesScreenProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

export function CoursesScreen({ courses, onCourseClick }: CoursesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <h2 className="text-2xl text-foreground mb-4">Professional Courses</h2>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses..."
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

      {/* Quick Filters */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-border">
        <Badge variant="secondary" className="bg-primary text-primary-foreground border-0 whitespace-nowrap">
          All Courses
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Filling Fast
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Starting Soon
        </Badge>
        <Badge variant="outline" className="whitespace-nowrap">
          Most Popular
        </Badge>
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20">
        <div className="space-y-5">
          {courses.map((course) => {
            const enrollmentPercentage = (course.enrolled / course.maxEnrollment) * 100;
            const isFillingFast = enrollmentPercentage > 75;

            return (
              <div
                key={course.id}
                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 flex items-center justify-center relative">
                  <BookOpen className="w-16 h-16 text-primary" />
                  {isFillingFast && (
                    <Badge className="absolute top-3 right-3 bg-accent-orange text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Filling Fast
                    </Badge>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-foreground flex-1 line-clamp-2">
                      {course.title}
                    </h4>
                    {course.verified && (
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0 ml-2 whitespace-nowrap">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    by {course.instructor}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Enrollment Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Enrollment Progress</span>
                      <span>
                        {course.enrolled}/{course.maxEnrollment} students
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFillingFast ? 'bg-accent-orange' : 'bg-accent'
                        }`}
                        style={{ width: `${enrollmentPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-2xl text-primary">€{course.price}</span>
                      <p className="text-[10px] text-muted-foreground">
                        Platform fee included
                      </p>
                    </div>
                    <Button
                      onClick={() => onCourseClick(course)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}