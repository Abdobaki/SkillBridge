import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { PortfolioExperience, PortfolioProject } from '../../../lib/portfolio-api';

interface ExperienceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PortfolioExperience | null;
  onSubmit: (data: PortfolioExperience) => Promise<void>;
}

export function ExperienceFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: ExperienceFormModalProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<PortfolioExperience>({
    defaultValues: initialData || {
      companyName: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[420px] rounded-3xl p-5">
        <DialogHeader className="border-b border-border pb-3 mb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-sm font-bold">
            {initialData ? 'Edit Experience' : 'Add Experience'}
          </DialogTitle>
          <button onClick={onClose} className="p-1 hover:bg-muted text-muted-foreground rounded-full">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Role Title
            </label>
            <Input 
              {...register('role', { required: true })} 
              placeholder="e.g. Senior Software Engineer"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Company Name
            </label>
            <Input 
              {...register('companyName', { required: true })} 
              placeholder="e.g. SkillBridge Inc"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Location (Optional)
            </label>
            <Input 
              {...register('location')} 
              placeholder="e.g. Algiers, Algeria (Hybrid)"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                Start Date
              </label>
              <Input 
                type="date"
                {...register('startDate', { required: true })} 
                className="text-xs h-9 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                End Date (Leave blank if present)
              </label>
              <Input 
                type="date"
                {...register('endDate')} 
                className="text-xs h-9 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Description / Responsibilities
            </label>
            <Textarea 
              {...register('description')} 
              rows={3} 
              placeholder="Detail your responsibilities and achievements..."
              className="text-xs rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full h-9 text-xs flex items-center justify-center gap-1.5 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Save Experience</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------
// PROJECT FORM MODAL
// ----------------------------------------------------

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PortfolioProject | null;
  onSubmit: (data: PortfolioProject) => Promise<void>;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: ProjectFormModalProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<PortfolioProject>({
    defaultValues: initialData || {
      title: '',
      description: '',
      role: '',
      projectUrl: '',
      githubRepoUrl: '',
      technologies: [],
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[420px] rounded-3xl p-5">
        <DialogHeader className="border-b border-border pb-3 mb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-sm font-bold">
            {initialData ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
          <button onClick={onClose} className="p-1 hover:bg-muted text-muted-foreground rounded-full">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Project Title
            </label>
            <Input 
              {...register('title', { required: true })} 
              placeholder="e.g. SkillBridge Platform"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Your Role / Contribution (Optional)
            </label>
            <Input 
              {...register('role')} 
              placeholder="e.g. Full Stack Architect"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Demo Project URL (Optional)
            </label>
            <Input 
              {...register('projectUrl')} 
              placeholder="https://example.com"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              GitHub Repository URL (Optional)
            </label>
            <Input 
              {...register('githubRepoUrl')} 
              placeholder="https://github.com/username/project"
              className="text-xs h-9 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
              Project Description
            </label>
            <Textarea 
              {...register('description')} 
              rows={3} 
              placeholder="What problem does this project solve?..."
              className="text-xs rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full h-9 text-xs flex items-center justify-center gap-1.5 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Save Project</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
