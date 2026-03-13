import { useState } from 'react';
import { X, Upload, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { JobAnnouncement, DeliveryMode } from '../types';
import { Badge } from './ui/badge';

interface CourseProposalFormProps {
  job: JobAnnouncement;
  trainerName: string;
  trainerEmail: string;
  onClose: () => void;
  onSubmit: (proposal: any) => void;
}

export function CourseProposalForm({
  job,
  trainerName,
  trainerEmail,
  onClose,
  onSubmit,
}: CourseProposalFormProps) {
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    skillsCovered: '',
    duration: '',
    deliveryMode: 'online' as DeliveryMode,
    basePrice: '',
    minStudents: '',
    maxStudents: '',
    startDate: '',
    instructorBio: '',
  });

  const platformCommissionRate = 0.15; // 15% commission

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const basePrice = parseFloat(formData.basePrice);
    const commission = Math.round(basePrice * platformCommissionRate);
    const finalPrice = basePrice + commission;

    const proposal = {
      id: `prop${Date.now()}`,
      courseTitle: formData.courseTitle,
      courseDescription: formData.courseDescription,
      skillsCovered: formData.skillsCovered.split(',').map(s => s.trim()),
      duration: formData.duration,
      deliveryMode: formData.deliveryMode,
      basePrice: basePrice,
      platformCommission: commission,
      finalPrice: finalPrice,
      minStudents: parseInt(formData.minStudents),
      maxStudents: parseInt(formData.maxStudents),
      startDate: formData.startDate,
      instructorBio: formData.instructorBio,
      relatedJobId: job.id,
      relatedJobTitle: job.title,
      trainerId: 'trainer1',
      trainerName: trainerName,
      trainerEmail: trainerEmail,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSubmit(proposal);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-3xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl text-foreground">Propose a Training Course</h2>
            <p className="text-sm text-muted-foreground mt-1">For: {job.title}</p>
          </div>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Course Title */}
            <div>
              <Label htmlFor="courseTitle">Course Title *</Label>
              <Input
                id="courseTitle"
                value={formData.courseTitle}
                onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                placeholder="e.g., Advanced Data Analysis with Python"
                required
                className="mt-2"
              />
            </div>

            {/* Course Description */}
            <div>
              <Label htmlFor="courseDescription">Course Description *</Label>
              <Textarea
                id="courseDescription"
                value={formData.courseDescription}
                onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                placeholder="Detailed description of what students will learn..."
                required
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Skills Covered */}
            <div>
              <Label htmlFor="skillsCovered">Skills Covered *</Label>
              <Input
                id="skillsCovered"
                value={formData.skillsCovered}
                onChange={(e) => setFormData({ ...formData, skillsCovered: e.target.value })}
                placeholder="Python, SQL, Machine Learning (comma-separated)"
                required
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
            </div>

            {/* Duration and Delivery Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 8 weeks"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="deliveryMode">Delivery Mode *</Label>
                <Select
                  value={formData.deliveryMode}
                  onValueChange={(value: DeliveryMode) =>
                    setFormData({ ...formData, deliveryMode: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <Label htmlFor="basePrice">Base Price per Participant (€) *</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="299"
                required
                className="mt-2"
              />
              {formData.basePrice && (
                <div className="mt-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-sm text-foreground">Pricing Breakdown</p>
                  </div>
                  <div className="space-y-1 text-sm ml-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your base price:</span>
                      <span className="text-foreground">€{formData.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform fee (15%):</span>
                      <span className="text-foreground">
                        €{Math.round(parseFloat(formData.basePrice) * platformCommissionRate)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-border">
                      <span className="text-foreground font-medium">Final student price:</span>
                      <span className="text-foreground font-medium">
                        €
                        {parseFloat(formData.basePrice) +
                          Math.round(parseFloat(formData.basePrice) * platformCommissionRate)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Student Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minStudents">Minimum Students *</Label>
                <Input
                  id="minStudents"
                  type="number"
                  value={formData.minStudents}
                  onChange={(e) => setFormData({ ...formData, minStudents: e.target.value })}
                  placeholder="10"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="maxStudents">Maximum Students *</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                  placeholder="30"
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Proposed Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            {/* Instructor Bio */}
            <div>
              <Label htmlFor="instructorBio">Your Instructor Bio *</Label>
              <Textarea
                id="instructorBio"
                value={formData.instructorBio}
                onChange={(e) => setFormData({ ...formData, instructorBio: e.target.value })}
                placeholder="Brief description of your experience and qualifications..."
                required
                rows={3}
                className="mt-2"
              />
            </div>

            {/* Info Notice */}
            <div className="bg-accent-orange/10 rounded-2xl p-4 border border-accent-orange/20">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-foreground mb-1">Course Review Process</h4>
                  <p className="text-sm text-muted-foreground">
                    Your course proposal will be reviewed by our admin team. You'll be notified once
                    it's approved or if any changes are needed. Courses are only published after
                    admin approval.
                  </p>
                </div>
              </div>
            </div>
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
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );
}
