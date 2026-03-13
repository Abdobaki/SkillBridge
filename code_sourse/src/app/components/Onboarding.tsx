import { Briefcase, GraduationCap, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
  onLogin: () => void;
}

export function Onboarding({ onComplete, onLogin }: OnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      icon: Briefcase,
      title: 'Discover Verified Job Opportunities',
      description:
        'Access thousands of verified professional jobs and doctoral positions from trusted organizations worldwide.',
      color: 'text-primary',
    },
    {
      icon: GraduationCap,
      title: 'Upgrade Your Skills with Expert Courses',
      description:
        'Learn from industry experts with professionally designed courses tailored for career advancement.',
      color: 'text-accent',
    },
    {
      icon: Crown,
      title: 'Unlock Full Access with Premium',
      description:
        'Get unlimited access to detailed job information, early announcements, and exclusive course content.',
      color: 'text-accent-orange',
    },
  ];

  const currentScreenData = screens[currentScreen];
  const Icon = currentScreenData.icon;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-primary/5 to-background">
      {/* Top Progress Indicators */}
      <div className="flex gap-2 justify-center pt-12 px-8">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentScreen
                ? 'w-8 bg-primary'
                : 'w-6 bg-border'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-8`}
        >
          <Icon className={`w-16 h-16 ${currentScreenData.color}`} />
        </div>

        <h1 className="text-2xl mb-4 text-foreground px-4">
          {currentScreenData.title}
        </h1>

        <p className="text-muted-foreground leading-relaxed px-2">
          {currentScreenData.description}
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="px-8 pb-12 space-y-3">
        {currentScreen === screens.length - 1 ? (
          <>
            <Button
              onClick={onComplete}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
            <Button
              onClick={onLogin}
              variant="outline"
              className="w-full h-12"
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setCurrentScreen(currentScreen + 1)}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next
            </Button>
            <button
              onClick={() => setCurrentScreen(screens.length - 1)}
              className="w-full text-muted-foreground text-sm py-2"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}