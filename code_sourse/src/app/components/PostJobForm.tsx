import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserRole, JobAnnouncement } from '../types';

interface PostJobFormProps {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  onClose: () => void;
  onSubmit: (job: JobAnnouncement) => void;
}

export function PostJobForm({
  userRole,
  userName,
  userEmail,
  onClose,
  onSubmit,
}: PostJobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'job' as 'job' | 'doctoral',
    category: 'IT',
    description: '',
    requirements: '',
    applicationDeadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const job: JobAnnouncement = {
      id: `job${Date.now()}`,
      title: formData.title,
      company: formData.company,
      location: formData.location,
      salary: formData.salary || undefined,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      requirements: formData.requirements.split('\n').map(r => r.trim()).filter(r => r),
      applicationDeadline: formData.applicationDeadline,
      posted: 'Just now',
      verified: userRole === 'admin',
      postStatus: userRole === 'admin' ? 'approved' : 'pending',
      postedByRole: userRole,
      postedByName: userName,
      postedByEmail: userEmail,
    };

    onSubmit(job);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-3xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl text-foreground">Post a Job Announcement</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share an opportunity with the community
            </p>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Senior Data Scientist"
                required
                className="mt-2"
              />
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company">Company / Organization *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., TechCorp International"
                required
                className="mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Berlin, Germany"
                required
                className="mt-2"
              />
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobType">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'job' | 'doctoral') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="doctoral">Doctoral Position</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Factory">Factory</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary */}
            <div>
              <Label htmlFor="salary">Salary Range (optional)</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., €55,000 - €70,000"
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the role and responsibilities..."
                required
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Enter each requirement on a new line..."
                required
                rows={4}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">One requirement per line</p>
            </div>

            {/* Application Deadline */}
            <div>
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            {/* Info Notice */}
            {userRole !== 'admin' && (
              <div className="bg-accent-orange/10 rounded-2xl p-4 border border-accent-orange/20">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-foreground mb-1">Review Process</h4>
                    <p className="text-sm text-muted-foreground">
                      Your job announcement will be reviewed by our admin team before it's
                      published. You'll be notified once it's approved or if any changes are needed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {userRole === 'admin' && (
              <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-foreground mb-1">Admin Post</h4>
                    <p className="text-sm text-muted-foreground">
                      As an admin, your job announcement will be published immediately
                      without requiring approval.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {userRole === 'admin' ? 'Publish Now' : 'Submit for Review'}
          </Button>
        </div>
      </div>
    </div>
  );
}
