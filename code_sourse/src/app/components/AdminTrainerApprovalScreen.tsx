import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  User,
  Phone,
  Mail,
  Briefcase,
  FileText,
  Download,
  BookOpen,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { TrainerApplication } from '../types';

interface AdminTrainerApprovalScreenProps {
  applications: TrainerApplication[];
  onBack: () => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string, feedback: string) => void;
  onNavigateToCourseApproval?: () => void;
  onNavigateToJobApproval?: () => void;
  onPostJob?: () => void;
  onLogout?: () => void;
}

export function AdminTrainerApprovalScreen({
  applications,
  onBack,
  onApprove,
  onReject,
  onNavigateToCourseApproval,
  onNavigateToJobApproval,
  onPostJob,
  onLogout,
}: AdminTrainerApprovalScreenProps) {
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingApplications = applications.filter((a) => a.status === 'pending');
  const approvedApplications = applications.filter((a) => a.status === 'approved');
  const rejectedApplications = applications.filter((a) => a.status === 'rejected');

  const handleApprove = (applicationId: string) => {
    onApprove(applicationId);
    setSelectedApplication(null);
  };

  const handleReject = () => {
    if (selectedApplication) {
      onReject(selectedApplication.id, rejectionFeedback);
      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionFeedback('');
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl text-foreground">Admin Dashboard</h1>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5 text-destructive" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Manage trainer applications & approvals</p>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl text-accent-orange mb-1">{pendingApplications.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-accent mb-1">{approvedApplications.length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-destructive mb-1">{rejectedApplications.length}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="px-6 py-3 bg-card border-b border-border flex gap-2 overflow-x-auto">
        {onNavigateToCourseApproval && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToCourseApproval}
            className="shrink-0"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Course Approvals
          </Button>
        )}
        {onNavigateToJobApproval && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToJobApproval}
            className="shrink-0"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Job Approvals
          </Button>
        )}
        {onPostJob && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPostJob}
            className="shrink-0"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {!selectedApplication ? (
          <div className="space-y-4">
            {/* Pending Applications First */}
            {pendingApplications.length > 0 && (
              <>
                <h3 className="text-foreground mb-3">Pending Review</h3>
                {pendingApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-card rounded-2xl p-5 border border-accent-orange/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{application.name}</h4>
                        <p className="text-sm text-muted-foreground">{application.profession}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-accent-orange/10 text-accent-orange border-0"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{application.phoneNumber}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Applied: {application.appliedDate}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Application
                    </Button>
                  </div>
                ))}
              </>
            )}

            {/* Other Applications */}
            {(approvedApplications.length > 0 || rejectedApplications.length > 0) && (
              <>
                <h3 className="text-foreground mb-3 mt-6">All Applications</h3>
                {[...approvedApplications, ...rejectedApplications].map((application) => (
                  <div key={application.id} className="bg-card rounded-2xl p-5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{application.name}</h4>
                        <p className="text-sm text-muted-foreground">{application.email}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          application.status === 'approved'
                            ? 'bg-accent/10 text-accent border-0'
                            : 'bg-destructive/10 text-destructive border-0'
                        }
                      >
                        {application.status === 'approved' && (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        )}
                        {application.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {application.status}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
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
            <Button
              variant="ghost"
              onClick={() => setSelectedApplication(null)}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to list
            </Button>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl text-foreground">Trainer Application</h2>
                <Badge
                  variant="secondary"
                  className={
                    selectedApplication.status === 'approved'
                      ? 'bg-accent/10 text-accent border-0'
                      : selectedApplication.status === 'pending'
                      ? 'bg-accent-orange/10 text-accent-orange border-0'
                      : 'bg-destructive/10 text-destructive border-0'
                  }
                >
                  {selectedApplication.status}
                </Badge>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="text-foreground">{selectedApplication.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedApplication.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="text-foreground">{selectedApplication.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Profession</p>
                    <p className="text-foreground">{selectedApplication.profession}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-foreground mb-2">Professional Bio</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedApplication.bio}</p>
              </div>

              {/* CV Download */}
              <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-foreground mb-1">{selectedApplication.cvFileName}</p>
                      <p className="text-xs text-muted-foreground">Curriculum Vitae</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Application Date */}
              <p className="text-sm text-muted-foreground mb-6">
                Applied on: {selectedApplication.appliedDate}
              </p>

              {/* Admin Feedback if rejected */}
              {selectedApplication.adminFeedback && (
                <div className="mb-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground mb-1">Previous Feedback</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedApplication.adminFeedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
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
                    onClick={() => handleApprove(selectedApplication.id)}
                    className="flex-1 bg-accent text-white hover:bg-accent/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve as Trainer
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
              <h3 className="text-lg text-foreground">Reject Application</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Please provide feedback to help the applicant understand why their application was
                rejected:
              </p>
              <Textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Explain why the application needs revision or was rejected..."
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
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
