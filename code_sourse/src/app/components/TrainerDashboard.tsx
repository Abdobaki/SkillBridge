import { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  DollarSign,
  Settings,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  PlusCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CourseProposal, Enrollment } from '../types';

interface TrainerDashboardProps {
  trainerName: string;
  trainerEmail: string;
  proposals: CourseProposal[];
  enrollments?: Enrollment[];
  onBack: () => void;
  onViewProposals: () => void;
  onBrowseJobs?: () => void;
  onPostJob?: () => void;
}

export function TrainerDashboard({
  trainerName,
  trainerEmail,
  proposals,
  enrollments,
  onBack,
  onViewProposals,
  onBrowseJobs,
  onPostJob,
}: TrainerDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');

  // Calculate statistics
  const pendingProposals = proposals.filter((p) => p.status === 'pending').length;
  const approvedProposals = proposals.filter((p) => p.status === 'approved').length;
  const rejectedProposals = proposals.filter((p) => p.status === 'rejected').length;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-primary">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-white mb-1">Trainer Dashboard</h1>
            <p className="text-sm text-white/80">{trainerName}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          <Button
            variant={activeSection === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('overview')}
            className={
              activeSection === 'overview'
                ? 'bg-white text-primary'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeSection === 'proposals' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('proposals')}
            className={
              activeSection === 'proposals'
                ? 'bg-white text-primary'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Proposals
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                    {pendingProposals} Pending
                  </Badge>
                </div>
                <p className="text-2xl text-foreground mb-1">{proposals.length}</p>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
              </div>

              <div className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-2xl text-foreground mb-1">{approvedProposals}</p>
                <p className="text-sm text-muted-foreground">Approved Courses</p>
              </div>
            </div>

            {/* Recent Proposals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Recent Proposals</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewProposals}
                  className="text-primary"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {proposals.length === 0 ? (
                  <div className="bg-card rounded-2xl p-8 border border-border text-center">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground mb-1">No proposals yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start by browsing job opportunities and proposing courses
                    </p>
                  </div>
                ) : (
                  proposals.slice(0, 3).map((proposal) => (
                    <div key={proposal.id} className="bg-card rounded-2xl p-4 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-foreground flex-1">{proposal.courseTitle}</h4>
                        <Badge
                          variant="secondary"
                          className={
                            proposal.status === 'approved'
                              ? 'bg-accent/10 text-accent border-0'
                              : proposal.status === 'pending'
                              ? 'bg-accent-orange/10 text-accent-orange border-0'
                              : 'bg-destructive/10 text-destructive border-0'
                          }
                        >
                          {proposal.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {proposal.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {proposal.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Related to: {proposal.relatedJobTitle}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>€{proposal.finalPrice}</span>
                        <span>•</span>
                        <span>{proposal.duration}</span>
                        <span>•</span>
                        <span>
                          min {proposal.minStudents} students
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                {onBrowseJobs && (
                  <Button
                    variant="outline"
                    onClick={onBrowseJobs}
                    className="justify-start h-auto py-4 border-accent text-accent hover:bg-accent/10"
                  >
                    <Search className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="text-foreground">Browse Job Opportunities</p>
                      <p className="text-xs text-muted-foreground">
                        Find new opportunities to create courses
                      </p>
                    </div>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onViewProposals}
                  className="justify-start h-auto py-4"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="text-foreground">Manage Course Proposals</p>
                    <p className="text-xs text-muted-foreground">
                      View and edit your course submissions
                    </p>
                  </div>
                </Button>
                {onPostJob && (
                  <Button
                    variant="outline"
                    onClick={onPostJob}
                    className="justify-start h-auto py-4 border-primary text-primary hover:bg-primary/10"
                  >
                    <PlusCircle className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="text-foreground">Post a Job Announcement</p>
                      <p className="text-xs text-muted-foreground">
                        Share job opportunities with the community
                      </p>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'proposals' && (
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 border border-border text-center">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground mb-1">No proposals yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by browsing job opportunities and proposing courses
                </p>
                {onBrowseJobs && (
                  <Button onClick={onBrowseJobs} className="bg-primary">
                    Browse Jobs
                  </Button>
                )}
              </div>
            ) : (
              proposals.map((proposal) => (
                <div key={proposal.id} className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-foreground mb-1">{proposal.courseTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        Related to: {proposal.relatedJobTitle}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        proposal.status === 'approved'
                          ? 'bg-accent/10 text-accent border-0'
                          : proposal.status === 'pending'
                          ? 'bg-accent-orange/10 text-accent-orange border-0'
                          : 'bg-destructive/10 text-destructive border-0'
                      }
                    >
                      {proposal.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {proposal.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {proposal.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{proposal.courseDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {proposal.skillsCovered.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Your Price</p>
                      <p className="text-foreground">€{proposal.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Student Price</p>
                      <p className="text-foreground">€{proposal.finalPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Duration</p>
                      <p className="text-foreground">{proposal.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Enrollment</p>
                      <p className="text-foreground">
                        min {proposal.minStudents} students
                      </p>
                    </div>
                  </div>

                  {proposal.adminFeedback && (
                    <div className="mt-4 p-3 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                      <div className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground mb-1">Admin Feedback</p>
                          <p className="text-sm text-muted-foreground">{proposal.adminFeedback}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    {proposal.status === 'rejected' && (
                      <Button size="sm" className="flex-1 bg-primary">
                        Resubmit
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}