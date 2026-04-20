import { ArrowLeft, Briefcase, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { JobAnnouncement } from '../types';

interface TrainerJobBrowseScreenProps {
  jobs: JobAnnouncement[];
  onBack: () => void;
  onJobClick: (job: JobAnnouncement) => void;
}

export function TrainerJobBrowseScreen({ jobs, onBack, onJobClick }: TrainerJobBrowseScreenProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-primary">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl text-white mb-2">Browse Job Opportunities</h1>
        <p className="text-white/80">Find opportunities to create courses for</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onJobClick(job)}
              className="bg-card rounded-2xl p-5 border border-border cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{
                    (() => {
                      try { return formatDistanceToNow(new Date(job.posted), { addSuffix: true }); }
                      catch { return job.posted; }
                    })()
                  }</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary">{job.category}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-accent hover:text-accent hover:bg-accent/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJobClick(job);
                  }}
                >
                  <GraduationCap className="w-4 h-4 mr-1" />
                  Propose Course
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
