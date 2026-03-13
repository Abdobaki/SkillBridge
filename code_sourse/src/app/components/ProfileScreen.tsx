import { User, Crown, Briefcase, BookOpen, Bookmark, CreditCard, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserType } from '../types';

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  userProfession: string;
  userType: UserType;
  savedItemsCount: number;
  onUpgrade: () => void;
  onLogout: () => void;
}

export function ProfileScreen({
  userName,
  userEmail,
  userProfession,
  userType,
  savedItemsCount,
  onUpgrade,
  onLogout,
}: ProfileScreenProps) {
  const menuItems = [
    {
      icon: Briefcase,
      label: 'My Applications',
      badge: '3',
      color: 'text-primary',
    },
    {
      icon: BookOpen,
      label: 'My Courses',
      badge: '2',
      color: 'text-accent',
    },
    {
      icon: Bookmark,
      label: 'Saved',
      badge: savedItemsCount.toString(),
      color: 'text-accent-orange',
    },
    {
      icon: CreditCard,
      label: 'Payment History',
      color: 'text-muted-foreground',
    },
    {
      icon: Settings,
      label: 'Settings',
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-8 rounded-b-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-primary-foreground text-xl mb-1">
              {userName}
            </h2>
            <p className="text-primary-foreground/80 text-sm mb-2">
              {userProfession}
            </p>
            {userType === 'premium' ? (
              <Badge className="bg-accent-orange text-white border-0 w-fit">
                <Crown className="w-3 h-3 mr-1" />
                Premium Member
              </Badge>
            ) : (
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 w-fit">
                Free Plan
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Email */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-6">
          <p className="text-xs text-muted-foreground mb-1">Email</p>
          <p className="text-foreground">{userEmail}</p>
        </div>

        {/* Upgrade CTA for Free Users */}
        {userType === 'free' && (
          <div className="bg-gradient-to-br from-accent-orange/20 to-primary/10 rounded-2xl p-6 border border-accent-orange/30 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-foreground mb-1">Upgrade to Premium</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock all features and get unlimited access
                </p>
                <Button
                  onClick={onUpgrade}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full bg-card rounded-2xl p-4 border border-border hover:border-primary transition-colors flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 text-left text-foreground">
                  {item.label}
                </span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {item.badge}
                  </Badge>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Subscription Status for Premium Users */}
        {userType === 'premium' && (
          <div className="bg-card rounded-2xl p-5 border border-border mb-6">
            <h4 className="text-foreground mb-3">Subscription</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                <p className="text-foreground">Premium Monthly</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
