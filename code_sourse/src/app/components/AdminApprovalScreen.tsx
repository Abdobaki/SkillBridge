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
  Users,
  DollarSign,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { CourseProposal } from '../types';

interface AdminApprovalScreenProps {
  proposals: CourseProposal[];
  onBack: () => void;
  onApprove: (proposalId: string) => void;
  onReject: (proposalId: string, feedback: string) => void;
}

export function AdminApprovalScreen({
  proposals,
  onBack,
  onApprove,
  onReject,
}: AdminApprovalScreenProps) {
  const [selectedProposal, setSelectedProposal] = useState<CourseProposal | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingProposals = proposals.filter((p) => p.status === 'pending');
  const approvedProposals = proposals.filter((p) => p.status === 'approved');
  const rejectedProposals = proposals.filter((p) => p.status === 'rejected');

  const handleApprove = (proposalId: string) => {
    onApprove(proposalId);
    setSelectedProposal(null);
  };

  const handleReject = () => {
    if (selectedProposal) {
      onReject(selectedProposal.id, rejectionFeedback);
      setShowRejectModal(false);
      setSelectedProposal(null);
      setRejectionFeedback('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground mb-2">Course Approval Dashboard</h1>
        <p className="text-sm text-muted-foreground">Review and approve trainer course proposals</p>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl text-accent-orange mb-1">{pendingProposals.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-accent mb-1">{approvedProposals.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-destructive mb-1">{rejectedProposals.length}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {!selectedProposal ? (
          <div className="space-y-4">
            {/* Pending Proposals First */}
            {pendingProposals.length > 0 && (
              <>
                <h3 className="text-foreground mb-3">Pending Review</h3>
                {pendingProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="bg-card rounded-2xl p-5 border border-accent-orange/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{proposal.courseTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Related to: {proposal.relatedJobTitle}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-accent-orange/10 text-accent-orange border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{proposal.trainerName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">€{proposal.finalPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {proposal.minStudents}-{proposal.maxStudents}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{proposal.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{proposal.deliveryMode}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProposal(proposal)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Details
                    </Button>
                  </div>
                ))}
              </>
            )}

            {/* Other Proposals */}
            {(approvedProposals.length > 0 || rejectedProposals.length > 0) && (
              <>
                <h3 className="text-foreground mb-3 mt-6">All Proposals</h3>
                {[...approvedProposals, ...rejectedProposals].map((proposal) => (
                  <div key={proposal.id} className="bg-card rounded-2xl p-5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{proposal.courseTitle}</h4>
                        <p className="text-sm text-muted-foreground">by {proposal.trainerName}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          proposal.status === 'approved'
                            ? 'bg-accent/10 text-accent border-0'
                            : 'bg-destructive/10 text-destructive border-0'
                        }
                      >
                        {proposal.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {proposal.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {proposal.status}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProposal(proposal)}
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
            <Button variant="ghost" onClick={() => setSelectedProposal(null)} className="p-0 h-auto">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to list
            </Button>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl text-foreground">{selectedProposal.courseTitle}</h2>
                <Badge
                  variant="secondary"
                  className={
                    selectedProposal.status === 'approved'
                      ? 'bg-accent/10 text-accent border-0'
                      : selectedProposal.status === 'pending'
                      ? 'bg-accent-orange/10 text-accent-orange border-0'
                      : 'bg-destructive/10 text-destructive border-0'
                  }
                >
                  {selectedProposal.status}
                </Badge>
              </div>

              {/* Trainer Info */}
              <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground">{selectedProposal.trainerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedProposal.trainerEmail}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{selectedProposal.instructorBio}</p>
              </div>

              {/* Related Job */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Related Job Announcement</p>
                <p className="text-foreground">{selectedProposal.relatedJobTitle}</p>
              </div>

              {/* Course Details */}
              <div className="mb-6">
                <h3 className="text-foreground mb-2">Course Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProposal.courseDescription}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-foreground mb-2">Skills Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProposal.skillsCovered.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Course Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-foreground">{selectedProposal.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery Mode</p>
                  <p className="text-foreground">{selectedProposal.deliveryMode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="text-foreground">{selectedProposal.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Enrollment Range</p>
                  <p className="text-foreground">
                    {selectedProposal.minStudents} - {selectedProposal.maxStudents} students
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                <h3 className="text-foreground mb-3">Pricing Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trainer base price:</span>
                    <span className="text-foreground">€{selectedProposal.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform commission:</span>
                    <span className="text-foreground">€{selectedProposal.platformCommission}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-foreground font-medium">Student pays:</span>
                    <span className="text-foreground font-medium">€{selectedProposal.finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Admin Feedback if rejected */}
              {selectedProposal.adminFeedback && (
                <div className="mb-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground mb-1">Previous Feedback</p>
                      <p className="text-sm text-muted-foreground">{selectedProposal.adminFeedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedProposal.status === 'pending' && (
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
                    onClick={() => handleApprove(selectedProposal.id)}
                    className="flex-1 bg-accent text-white hover:bg-accent/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
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
              <h3 className="text-lg text-foreground">Reject Course Proposal</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Please provide feedback to help the trainer improve their proposal:
              </p>
              <Textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Explain why the course needs revision..."
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
