import { useState } from 'react';
import { ArrowLeft, User, GraduationCap, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { UserRole } from '../types';

interface RoleSelectionScreenProps {
  onBack: () => void;
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelectionScreen({ onBack, onSelectRole }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      id: 'user' as UserRole,
      title: 'Professional / Student',
      icon: User,
      description: 'Browse job opportunities and enroll in courses',
      features: [
        'Access verified job announcements',
        'Enroll in professional training courses',
        'Save and track opportunities',
        'Premium subscription access',
      ],
    },
    {
      id: 'trainer' as UserRole,
      title: 'Trainer / Instructor',
      icon: GraduationCap,
      description: 'Create courses and teach professionals',
      features: [
        'Browse job announcements',
        'Propose courses for opportunities',
        'Manage students and enrollments',
        'Track earnings and performance',
      ],
    },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-primary">
        <button onClick={onBack} className="p-2 -ml-2 mb-6">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl text-white mb-2">Choose Your Role</h1>
        <p className="text-white/80">Select how you want to use the platform</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`bg-card rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-primary' : 'bg-primary/10'
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-primary'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg text-foreground">{role.title}</h3>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 bg-card border-t border-border">
        <Button
          onClick={() => selectedRole && onSelectRole(selectedRole)}
          disabled={!selectedRole}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
