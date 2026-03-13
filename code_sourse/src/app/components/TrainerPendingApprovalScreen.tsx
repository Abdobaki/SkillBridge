import { Clock, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { TrainerStatus } from '../types';

interface TrainerPendingApprovalScreenProps {
  trainerName?: string;
  trainerEmail?: string;
  status: TrainerStatus;
  onBack: () => void;
}

export function TrainerPendingApprovalScreen({
  trainerName = 'Trainer',
  trainerEmail = 'your email',
  status,
  onBack,
}: TrainerPendingApprovalScreenProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-accent-orange/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-accent-orange" />
          </div>

          {/* Title */}
          <h1 className="text-2xl text-foreground mb-3">Application Under Review</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for applying to become a trainer on our platform{trainerName !== 'Trainer' ? `, ${trainerName}` : ''}!
          </p>

          {/* Status Card */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-foreground mb-1">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    Your application has been received successfully
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-foreground mb-1">Admin Review in Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Our team is reviewing your CV and credentials
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-foreground mb-1">Email Notification</p>
                  <p className="text-sm text-muted-foreground">
                    We'll send updates to {trainerEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 mb-6">
            <h3 className="text-foreground mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Our admin team will review your CV and professional bio</li>
              <li>• This process typically takes 1-3 business days</li>
              <li>• You'll receive an email once your account is approved</li>
              <li>• After approval, you can start proposing courses</li>
            </ul>
          </div>

          {/* Logout Button */}
          <Button variant="outline" onClick={onBack} className="w-full">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}