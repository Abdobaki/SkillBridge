import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, CheckCircle2, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { JobAnnouncement } from '../types';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface AppliedScreenProps {
  appliedJobs: JobAnnouncement[];
  onJobClick: (job: JobAnnouncement) => void;
  onWithdraw: (jobId: string) => void;
  onBack: () => void;
}

export function AppliedScreen({
  appliedJobs,
  onJobClick,
  onWithdraw,
  onBack,
}: AppliedScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return (
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-0 ml-2 shrink-0 text-[10px]">
            Shortlisted
          </Badge>
        );
      case 'interview_scheduled':
        return (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-0 ml-2 shrink-0 text-[10px]">
            Interviewing
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-0 ml-2 shrink-0 text-[10px]">
            Offered
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border-0 ml-2 shrink-0 text-[10px]">
            Archived
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-0 ml-2 shrink-0 text-[10px]">
            Applied
          </Badge>
        );
    }
  };

  const filteredJobs = appliedJobs.filter((job) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
  });

  const getDeadlineInfo = (deadline: string) => {
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffMs = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return { text: 'Expired', color: 'text-destructive', urgent: false };
      if (diffDays <= 2) return { text: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, color: 'text-accent-orange', urgent: true };
      if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'text-accent-orange', urgent: false };
      return { text: formatDistanceToNow(deadlineDate, { addSuffix: true }), color: 'text-muted-foreground', urgent: false };
    } catch {
      return { text: deadline, color: 'text-muted-foreground', urgent: false };
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h2 className="text-2xl text-foreground">Applied Jobs</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search applied jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-input-background"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-20">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
            <h4 className="text-foreground mb-2">No applied jobs</h4>
            <p className="text-sm text-muted-foreground text-center">
              Jobs you apply to will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {filteredJobs.length} application{filteredJobs.length !== 1 ? 's' : ''}
            </p>
            {filteredJobs.map((job) => {
              const deadlineInfo = getDeadlineInfo(job.applicationDeadline);
              return (
                <div
                  key={job.id}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-7 h-7 text-accent" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-foreground line-clamp-1 flex-1">{job.title}</h4>
                        {renderStatusBadge((job as any).status || 'applied')}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{job.company}</p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{job.location}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className={`flex items-center gap-1 text-xs ${deadlineInfo.color}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Deadline: {deadlineInfo.text}</span>
                          {deadlineInfo.urgent && (
                            <span className="ml-1 px-1.5 py-0.5 bg-accent-orange/10 rounded-full text-[10px] font-medium">
                              ⚠ Urgent
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => onJobClick(job)}
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => onWithdraw(job.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Withdraw
                        </Button>
                      </div>
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
