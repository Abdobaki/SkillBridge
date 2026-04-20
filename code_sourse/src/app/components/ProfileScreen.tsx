import { useState, useRef } from 'react';
import { User as UserIcon, Crown, Briefcase, BookOpen, Bookmark, CreditCard, Settings, LogOut, ChevronRight, Camera, Check, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { UserType } from '../types';

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  userProfession: string;
  userType: UserType;
  profileImage?: string;
  savedItemsCount: number;
  coursesCount?: number;
  onUpgrade: () => void;
  onLogout: () => void;
  onSavedClick?: () => void;
  onCoursesClick?: () => void;
  onSettingsClick?: () => void;
  onUpdateProfile: (data: { name: string; profession: string; imageFile?: File }) => Promise<void>;
}

export function ProfileScreen({
  userName,
  userEmail,
  userProfession,
  userType,
  profileImage,
  savedItemsCount,
  coursesCount = 0,
  onUpgrade,
  onLogout,
  onSavedClick,
  onCoursesClick,
  onSettingsClick,
  onUpdateProfile,
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [editedProfession, setEditedProfession] = useState(userProfession);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    {
      icon: BookOpen,
      label: 'My Courses',
      badge: coursesCount.toString(),
      color: 'text-accent',
      onClick: onCoursesClick,
    },
    {
      icon: Bookmark,
      label: 'Saved',
      badge: savedItemsCount.toString(),
      color: 'text-accent-orange',
      onClick: onSavedClick,
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
      onClick: onSettingsClick,
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name: editedName,
        profession: editedProfession,
        imageFile: selectedFile || undefined,
      });
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(userName);
    setEditedProfession(userProfession);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-8 rounded-b-[32px] relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden border-2 border-white/20">
              {previewUrl || profileImage ? (
                <img src={previewUrl || profileImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-primary-foreground" />
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-primary text-white shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 text-lg"
                  placeholder="Your Name"
                />
                <Input 
                  value={editedProfession} 
                  onChange={(e) => setEditedProfession(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-7 text-sm"
                  placeholder="Your Profession"
                />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {!isEditing ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="text-primary-foreground hover:bg-white/10"
              >
                Edit
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-accent text-white hover:bg-accent/90"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCancel}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
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
        {userType === 'free' && !isEditing && (
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
                onClick={item.onClick}
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
