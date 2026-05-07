import { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Search,
  Trash2,
  Pencil,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  X,
  Save,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { JobAnnouncement } from '../types';

interface AdminJobHistoryScreenProps {
  jobs: JobAnnouncement[];
  onBack: () => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateJob: (jobId: string, updates: Partial<JobAnnouncement>) => void;
}

type FilterStatus = 'all' | 'active' | 'expired' | 'pending' | 'rejected';

export function AdminJobHistoryScreen({
  jobs,
  onBack,
  onDeleteJob,
  onUpdateJob,
}: AdminJobHistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [editingJob, setEditingJob] = useState<JobAnnouncement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Editing form state
  const [editTitle, setEditTitle] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSalary, setEditSalary] = useState('');

  const getJobStatus = (job: JobAnnouncement): 'active' | 'expired' | 'pending' | 'rejected' => {
    if (job.postStatus === 'pending') return 'pending';
    if (job.postStatus === 'rejected') return 'rejected';
    try {
      const deadline = new Date(job.applicationDeadline);
      if (deadline < new Date()) return 'expired';
    } catch { /* ignore */ }
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-accent-orange/10 text-accent-orange border-0">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const status = getJobStatus(job);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.postedByName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: jobs.length,
    active: jobs.filter((j) => getJobStatus(j) === 'active').length,
    expired: jobs.filter((j) => getJobStatus(j) === 'expired').length,
    pending: jobs.filter((j) => getJobStatus(j) === 'pending').length,
    rejected: jobs.filter((j) => getJobStatus(j) === 'rejected').length,
  };

  const handleStartEdit = (job: JobAnnouncement) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditCompany(job.company);
    setEditLocation(job.location);
    setEditDeadline(job.applicationDeadline);
    setEditDescription(job.description);
    setEditSalary(job.salary || '');
  };

  const handleSaveEdit = () => {
    if (!editingJob) return;
    onUpdateJob(editingJob.id, {
      title: editTitle,
      company: editCompany,
      location: editLocation,
      applicationDeadline: editDeadline,
      description: editDescription,
      salary: editSalary,
    });
    setEditingJob(null);
  };

  const handleConfirmDelete = (jobId: string) => {
    onDeleteJob(jobId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h2 className="text-2xl text-foreground">Job History</h2>
            <p className="text-sm text-muted-foreground">Manage all job announcements</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-input-background"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(['all', 'active', 'expired', 'pending', 'rejected'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
            <h4 className="text-foreground mb-2">No jobs found</h4>
            <p className="text-sm text-muted-foreground text-center">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </p>
            {filteredJobs.map((job) => {
              const status = getJobStatus(job);
              return (
                <div
                  key={job.id}
                  className={`bg-card rounded-2xl p-5 border ${
                    status === 'expired' ? 'border-muted opacity-75' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      status === 'expired' ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                      <Briefcase className={`w-6 h-6 ${status === 'expired' ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-foreground line-clamp-1 flex-1">{job.title}</h4>
                        {getStatusBadge(status)}
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">{job.company}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{job.applicationDeadline}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        Posted by: {job.postedByName} ({job.postedByRole})
                      </p>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStartEdit(job)}
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(job.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                          Delete
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

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-xl max-h-[85vh] flex flex-col">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
              <h3 className="text-lg text-foreground">Edit Job</h3>
              <button onClick={() => setEditingJob(null)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Title</label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Company</label>
                <Input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Location</label>
                <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Salary</label>
                <Input value={editSalary} onChange={(e) => setEditSalary(e.target.value)} placeholder="e.g. €40,000 - €60,000" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Application Deadline</label>
                <Input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
              <Button variant="outline" onClick={() => setEditingJob(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl shadow-xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg text-foreground mb-2">Delete Job?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. The job announcement will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleConfirmDelete(showDeleteConfirm)}
                  className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
