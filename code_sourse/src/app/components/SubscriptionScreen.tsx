import { Check, Crown, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface SubscriptionScreenProps {
  onBack: () => void;
  onSubscribe: (plan: 'free' | 'premium') => void;
}

export function SubscriptionScreen({ onBack, onSubscribe }: SubscriptionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = {
    free: [
      'Limited job announcements',
      'Basic search functionality',
      'No detailed access',
      'No course priority',
    ],
    premium: [
      'Full access to all job details',
      'Early access to new announcements',
      'Access to all courses',
      'Direct application links',
      'Advanced search filters',
      'Priority support',
      'Exclusive webinars',
      'Certificate of completion',
    ],
  };

  const pricing = {
    monthly: 29,
    yearly: 299, // ~25/month
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl mb-2">Choose Your Plan</h1>
        <p className="text-primary-foreground/80">
          Unlock your full potential
        </p>
      </div>

      <div className="px-6 py-6">
        {/* Plan Toggle */}
        <div className="flex gap-3 mb-8 bg-card rounded-2xl p-1.5 border border-border">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`flex-1 py-3 rounded-xl transition-all relative ${
              selectedPlan === 'yearly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Yearly
            <Badge className="absolute -top-2 -right-2 bg-accent text-white border-0 text-[10px] px-1.5">
              Save 14%
            </Badge>
          </button>
        </div>

        {/* Free Plan */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground mb-1">Free Plan</h3>
              <p className="text-2xl">€0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Crown className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {features.free.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            className="w-full h-11"
            disabled
          >
            Current Plan
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary relative overflow-hidden">
          <Badge className="absolute top-4 right-4 bg-accent text-white border-0">
            Popular
          </Badge>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground mb-1">Premium Plan</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl text-primary">
                  €{pricing[selectedPlan]}
                </p>
                <span className="text-muted-foreground text-sm">
                  /{selectedPlan === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {selectedPlan === 'yearly' && (
                <p className="text-xs text-accent mt-1">
                  Only €25/month when billed annually
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {features.premium.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => onSubscribe('premium')}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Subscribe Now
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            All plans include secure payment processing. Cancel anytime, no questions asked.
            30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}