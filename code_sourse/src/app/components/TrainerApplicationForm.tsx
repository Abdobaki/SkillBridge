import { useState } from 'react';
import { ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface TrainerApplicationFormProps {
  onBack?: () => void;
  onClose?: () => void;
  onSubmit: (application: any) => void;
}

export function TrainerApplicationForm({ onBack, onClose, onSubmit }: TrainerApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profession: '',
    bio: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is PDF or DOC/DOCX
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (validTypes.includes(file.type)) {
        setCvFile(file);
      } else {
        alert('Please upload a PDF or Word document');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const application = {
      id: `trainer-app-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      profession: formData.profession,
      bio: formData.bio,
      cvFile: cvFile ? URL.createObjectURL(cvFile) : null,
      cvFileName: cvFile ? cvFile.name : null,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    onSubmit(application);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-primary">
        <button onClick={onBack || onClose} className="p-2 -ml-2 mb-6">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl text-white mb-2">Apply as a Trainer</h1>
        <p className="text-white/80">Submit your application for admin review</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Info Notice */}
          <div className="bg-accent-orange/10 rounded-2xl p-4 border border-accent-orange/20">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
              <div>
                <h4 className="text-foreground mb-1">Application Review Process</h4>
                <p className="text-sm text-muted-foreground">
                  Your application will be reviewed by our admin team. You'll receive an email
                  notification once your account is approved or if additional information is needed.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-foreground mb-4">Personal Information</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+1 234 567 8900"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="profession">Profession / Expertise *</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g., Data Scientist, Healthcare Consultant"
                  required
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Professional Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about your experience, qualifications, and why you want to become a trainer on our platform..."
              required
              rows={5}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 100 characters. This will be visible to students.
            </p>
          </div>

          {/* CV Upload */}
          <div>
            <Label htmlFor="cv">Upload Your CV / Resume <span className="text-muted-foreground text-xs">(Optional)</span></Label>
            <div className="mt-2">
              <label
                htmlFor="cv"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/30 transition-colors bg-card"
              >
                {cvFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-10 h-10 text-accent mb-2" />
                    <p className="text-sm text-foreground mb-1">{cvFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setCvFile(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-foreground mb-1">Click to upload CV</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (Max 10MB)</p>
                  </div>
                )}
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Bottom Button */}
      <div className="p-6 bg-card border-t border-border">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}