import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Moon,
  Sun,
  Lock,
  Bell,
  BellRing,
  Briefcase,
  BookOpen,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Shield,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { changePassword } from '../../lib/api';
import { toast } from 'sonner';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  // Dark Mode
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Change Password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('notificationPrefs');
      return saved
        ? JSON.parse(saved)
        : {
            newCourses: true,
            jobUpdates: true,
            enrollments: true,
            promotional: false,
          };
    } catch {
      return {
        newCourses: true,
        jobUpdates: true,
        enrollments: true,
        promotional: false,
      };
    }
  });

  // Dark Mode toggle
  const handleDarkToggle = (checked: boolean) => {
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Restore theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // Change Password handler
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(newPassword);
      toast.success('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err: any) {
      toast.error('Failed to change password: ' + err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Notification toggle handler
  const handleNotificationToggle = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem('notificationPrefs', JSON.stringify(updated));
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-6 rounded-b-[32px]">
        <button onClick={onBack} className="p-2 -ml-2 mb-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl text-white">Settings</h1>
        <p className="text-sm text-white/70 mt-1">Manage your preferences</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* ── Appearance ── */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Appearance
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {isDark ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-accent-orange" />
                  )}
                </div>
                <div>
                  <p className="text-foreground font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {isDark ? 'Dark theme active' : 'Light theme active'}
                  </p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={handleDarkToggle} />
            </div>
          </div>
        </div>

        {/* ── Security ── */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Security
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="text-foreground font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">
                    Update your account password
                  </p>
                </div>
              </div>
              <Shield className="w-5 h-5 text-muted-foreground" />
            </button>

            {showPasswordForm && (
              <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {newPassword && newPassword.length < 6 && (
                  <p className="text-xs text-destructive">
                    Password must be at least 6 characters
                  </p>
                )}
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
                <Button
                  onClick={handleChangePassword}
                  disabled={
                    isChangingPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    newPassword.length < 6
                  }
                  className="w-full bg-primary text-primary-foreground"
                >
                  {isChangingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Notifications ── */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Notifications
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {/* New Courses */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium">New Courses</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified about new courses
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.newCourses}
                onCheckedChange={(v) => handleNotificationToggle('newCourses', v)}
              />
            </div>

            {/* Job Updates */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Job Updates</p>
                  <p className="text-xs text-muted-foreground">
                    New job opportunities alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.jobUpdates}
                onCheckedChange={(v) => handleNotificationToggle('jobUpdates', v)}
              />
            </div>

            {/* Enrollment Confirmations */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Enrollments</p>
                  <p className="text-xs text-muted-foreground">
                    Enrollment confirmations
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.enrollments}
                onCheckedChange={(v) =>
                  handleNotificationToggle('enrollments', v)
                }
              />
            </div>

            {/* Promotional */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Promotional</p>
                  <p className="text-xs text-muted-foreground">
                    Marketing emails and offers
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.promotional}
                onCheckedChange={(v) =>
                  handleNotificationToggle('promotional', v)
                }
              />
            </div>
          </div>
        </div>

        {/* ── About ── */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            About
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden p-4">
            <div className="flex items-center justify-between">
              <p className="text-foreground font-medium">App Version</p>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
