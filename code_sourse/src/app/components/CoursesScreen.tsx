import { Search, BookOpen, SlidersHorizontal, TrendingUp, Clock, X, Check, Bookmark } from 'lucide-react';
import { Course } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

const COURSE_CATEGORIES = [
  'IT',
  'Engineering',
  'Healthcare',
  'Factory',
  'Government',
  'Academic',
  'Data Science',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Software Development',
  'Cybersecurity',
  'Finance',
  'Marketing',
  'Human Resources',
  'Education',
  'Research',
  'Design',
  'Legal',
  'Logistics',
];

interface CoursesScreenProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  onSaveToggle?: (id: string, type: 'job' | 'course') => void;
  savedItems?: string[];
}

export function CoursesScreen({ courses, onCourseClick, onSaveToggle, savedItems = [] }: CoursesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // Filter courses by search query AND selected categories
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
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
            variant={showFilters ? 'default' : 'outline'}
            size="icon"
            className={`h-11 w-11 shrink-0 ${showFilters ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Active filter chips */}
        {selectedCategories.length > 0 && !showFilters && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Filters:</span>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 whitespace-nowrap text-xs cursor-pointer hover:bg-primary/20"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <button
              onClick={clearFilters}
              className="text-xs text-destructive whitespace-nowrap"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="px-6 py-4 bg-card border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-foreground font-medium">Filter by Category</h3>
            <div className="flex items-center gap-3">
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-destructive"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {COURSE_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {category}
                </button>
              );
            })}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
            </p>
          )}
          <Button
            onClick={() => setShowFilters(false)}
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="w-4 h-4 mr-2" />
            Search{selectedCategories.length > 0 ? ` (${selectedCategories.length} filters)` : ''}
          </Button>
        </div>
      )}

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-foreground mb-1">No courses found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
            {selectedCategories.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-xs text-muted-foreground">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </p>
            {filteredCourses.map((course) => {
              const enrollmentPercentage = Math.min((course.enrolled / course.minEnrollment) * 100, 100);
              const isFillingFast = course.enrolled >= course.minEnrollment;

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
                    <div className="flex items-center gap-1 ml-2">
                      {course.verified && (
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-0 whitespace-nowrap">
                          Verified
                        </Badge>
                      )}
                      {onSaveToggle && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSaveToggle(course.id, 'course');
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted"
                        >
                          <Bookmark
                            className={`w-5 h-5 ${
                              savedItems.includes(`course:${course.id}`)
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      )}
                    </div>
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
                        {course.enrolled} enrolled (min {course.minEnrollment})
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
        )}
      </div>
    </div>
  );
}