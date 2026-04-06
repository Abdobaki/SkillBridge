import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  User,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { JobAnnouncement } from '../types';

interface AdminJobApprovalScreenProps {
  jobs: JobAnnouncement[];
  onBack: () => void;
  onApprove: (jobId: string) => void;
  onReject: (jobId: string, feedback: string) => void;
}

export function AdminJobApprovalScreen({
  jobs,
  onBack,
  onApprove,
  onReject,
}: AdminJobApprovalScreenProps) {
  const [selectedJob, setSelectedJob] = useState<JobAnnouncement | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingJobs = jobs.filter((j) => j.postStatus === 'pending');
  const approvedJobs = jobs.filter((j) => j.postStatus === 'approved');
  const rejectedJobs = jobs.filter((j) => j.postStatus === 'rejected');

  const handleApprove = (jobId: string) => {
    onApprove(jobId);
    setSelectedJob(null);
  };

  const handleReject = () => {
    if (selectedJob) {
      onReject(selectedJob.id, rejectionFeedback);
      setShowRejectModal(false);
      setSelectedJob(null);
      setRejectionFeedback('');
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground mb-2">Job Approval Dashboard</h1>
        <p className="text-sm text-muted-foreground">Review and approve job announcements</p>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl text-accent-orange mb-1">{pendingJobs.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-accent mb-1">{approvedJobs.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-destructive mb-1">{rejectedJobs.length}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {!selectedJob ? (
          <div className="space-y-4">
            {/* Pending Jobs First */}
            {pendingJobs.length > 0 && (
              <>
                <h3 className="text-foreground mb-3">Pending Review</h3>
                {pendingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-card rounded-2xl p-5 border border-accent-orange/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-accent-orange/10 text-accent-orange border-0"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Posted by: {job.postedByName} ({job.postedByRole})</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{job.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{job.applicationDeadline}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Details
                    </Button>
                  </div>
                ))}
              </>
            )}

            {pendingJobs.length === 0 && (
              <div className="bg-card rounded-2xl p-8 border border-border text-center">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
                <p className="text-foreground mb-1">All Caught Up!</p>
                <p className="text-sm text-muted-foreground">
                  No pending job announcements to review.
                </p>
              </div>
            )}

            {/* Processed Jobs */}
            {(approvedJobs.filter(j => j.postedByRole !== 'admin').length > 0 || rejectedJobs.length > 0) && (
              <>
                <h3 className="text-foreground mb-3 mt-6">Reviewed Jobs</h3>
                {[...approvedJobs.filter(j => j.postedByRole !== 'admin'), ...rejectedJobs].map((job) => (
                  <div key={job.id} className="bg-card rounded-2xl p-5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">by {job.postedByName}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          job.postStatus === 'approved'
                            ? 'bg-accent/10 text-accent border-0'
                            : 'bg-destructive/10 text-destructive border-0'
                        }
                      >
                        {job.postStatus === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {job.postStatus === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {job.postStatus}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                      className="text-primary"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          // Detail View
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedJob(null)} className="p-0 h-auto">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to list
            </Button>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl text-foreground">{selectedJob.title}</h2>
                <Badge
                  variant="secondary"
                  className={
                    selectedJob.postStatus === 'approved'
                      ? 'bg-accent/10 text-accent border-0'
                      : selectedJob.postStatus === 'pending'
                      ? 'bg-accent-orange/10 text-accent-orange border-0'
                      : 'bg-destructive/10 text-destructive border-0'
                  }
                >
                  {selectedJob.postStatus}
                </Badge>
              </div>

              {/* Posted By Info */}
              <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground">{selectedJob.postedByName}</p>
                    <p className="text-sm text-muted-foreground">{selectedJob.postedByEmail}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-1">
                  {selectedJob.postedByRole === 'user' ? 'Regular User' : selectedJob.postedByRole === 'trainer' ? 'Trainer' : 'Admin'}
                </Badge>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Company</p>
                  <p className="text-foreground">{selectedJob.company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground">{selectedJob.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="text-foreground">{selectedJob.type === 'doctoral' ? 'Doctoral Position' : 'Job'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                  <p className="text-foreground">{selectedJob.applicationDeadline}</p>
                </div>
                {selectedJob.salary && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Salary</p>
                    <p className="text-foreground">{selectedJob.salary}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-foreground mb-2">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-foreground mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admin Feedback if rejected */}
              {selectedJob.adminFeedback && (
                <div className="mb-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground mb-1">Previous Feedback</p>
                      <p className="text-sm text-muted-foreground">{selectedJob.adminFeedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedJob.postStatus === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedJob.id)}
                    className="flex-1 bg-accent text-white hover:bg-accent/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve & Publish
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-xl">
            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-lg text-foreground">Reject Job Announcement</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Please provide feedback to help the poster understand why their announcement was
                rejected:
              </p>
              <Textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Explain why the job announcement was rejected..."
                rows={4}
              />
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionFeedback('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectionFeedback.trim()}
                className="flex-1 bg-destructive text-white hover:bg-destructive/90"
              >
                Reject with Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
