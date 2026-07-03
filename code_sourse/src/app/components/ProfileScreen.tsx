import { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Crown, 
  BookOpen, 
  Bookmark, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Camera, 
  Check, 
  X, 
  Loader2, 
  FileCheck,
  FileText,
  Plus,
  Github,
  Award,
  BookMarked,
  Upload
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { UserType } from '../types';
import { UserPortfolio, PortfolioExperience, PortfolioProject } from '../../lib/portfolio-api';
import { TimelineView } from './portfolio/TimelineView';
import { ExperienceFormModal, ProjectFormModal } from './portfolio/PortfolioEditor';
import { toast } from 'sonner';

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  userProfession: string;
  userType: UserType;
  profileImage?: string;
  savedItemsCount: number;
  appliedJobsCount?: number;
  coursesCount?: number;
  portfolio: UserPortfolio | null;
  onUpgrade: () => void;
  onLogout: () => void;
  onSavedClick?: () => void;
  onAppliedClick?: () => void;
  onCoursesClick?: () => void;
  onSettingsClick?: () => void;
  onUpdateProfile: (data: { name: string; profession: string; imageFile?: File }) => Promise<void>;
  
  // Portfolio actions
  onAddExperience: (exp: PortfolioExperience) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
  onAddProject: (proj: PortfolioProject) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onUploadCV: (file: File) => Promise<void>;
  onSaveGitHub: (username: string) => Promise<void>;
}

export function ProfileScreen({
  userName,
  userEmail,
  userProfession,
  userType,
  profileImage,
  savedItemsCount,
  appliedJobsCount = 0,
  coursesCount = 0,
  portfolio,
  onUpgrade,
  onLogout,
  onSavedClick,
  onAppliedClick,
  onCoursesClick,
  onSettingsClick,
  onUpdateProfile,
  
  onAddExperience,
  onDeleteExperience,
  onAddProject,
  onDeleteProject,
  onUploadCV,
  onSaveGitHub,
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [editedProfession, setEditedProfession] = useState(userProfession);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio'>('dashboard');

  // Portfolio dialog states
  const [isExpOpen, setIsExpOpen] = useState(false);
  const [isProjOpen, setIsProjOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<PortfolioExperience | null>(null);
  const [selectedProj, setSelectedProj] = useState<PortfolioProject | null>(null);
  
  // GitHub uploader state
  const [editingGitHub, setEditingGitHub] = useState(false);
  const [githubInput, setGithubInput] = useState(portfolio?.githubUsername || '');
  const [savingGitHub, setSavingGitHub] = useState(false);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCV, setUploadingCV] = useState(false);

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
      label: 'Favorites',
      badge: savedItemsCount.toString(),
      color: 'text-accent-orange',
      onClick: onSavedClick,
    },
    {
      icon: FileCheck,
      label: 'Applied Jobs',
      badge: appliedJobsCount.toString(),
      color: 'text-primary',
      onClick: onAppliedClick,
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

  // GitHub save handler
  const handleSaveGitHub = async () => {
    setSavingGitHub(true);
    try {
      await onSaveGitHub(githubInput);
      setEditingGitHub(false);
      toast.success('GitHub username updated.');
    } catch (err: any) {
      toast.error('Failed to update GitHub: ' + err.message);
    } finally {
      setSavingGitHub(false);
    }
  };

  // CV File Upload handler
  const handleCVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF format is supported for CV upload.');
        return;
      }
      setUploadingCV(true);
      try {
        await onUploadCV(file);
        toast.success('CV uploaded successfully!');
      } catch (err: any) {
        toast.error('CV upload failed: ' + err.message);
      } finally {
        setUploadingCV(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto pb-20 scrollbar-hide">
      {/* Header Profile Info card */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-12 pb-8 rounded-b-[32px] relative shadow-sm">
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
                <h2 className="text-primary-foreground text-xl mb-1 font-bold">
                  {userName}
                </h2>
                <p className="text-primary-foreground/85 text-xs mb-2">
                  {userProfession}
                </p>
                {userType === 'premium' ? (
                  <Badge className="bg-accent-orange text-white border-0 w-fit">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium Member
                  </Badge>
                ) : (
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 w-fit text-[10px]">
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
                className="text-primary-foreground hover:bg-white/10 font-bold"
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

      {/* Tabs selectors bar */}
      <div className="flex border-b border-border bg-card px-4 sticky top-0 z-40">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors focus:outline-none ${
            activeTab === 'dashboard'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors focus:outline-none ${
            activeTab === 'portfolio'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          My Portfolio
        </button>
      </div>

      {/* Main content split */}
      <div className="px-6 py-6 flex-1">
        {activeTab === 'dashboard' ? (
          /* Dashboard Content */
          <>
            <div className="bg-card rounded-2xl p-4 border border-border mb-6">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-foreground text-sm font-medium">{userEmail}</p>
            </div>

            {userType === 'free' && !isEditing && (
              <div className="bg-gradient-to-br from-accent-orange/20 to-primary/10 rounded-2xl p-6 border border-accent-orange/30 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground text-sm font-semibold mb-1">Upgrade to Premium</h4>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      Unlock all features, get recommended matches, and access AI CV checks
                    </p>
                    <Button
                      onClick={onUpgrade}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs rounded-full h-9 font-semibold"
                    >
                      View Plans
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
                    <span className="flex-1 text-left text-xs font-semibold text-foreground">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-4.5 h-4.5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>

            {userType === 'premium' && (
              <div className="bg-card rounded-2xl p-5 border border-border mb-6">
                <h4 className="text-foreground text-xs font-bold mb-3">Subscription</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-0.5">Current Plan</p>
                    <p className="text-xs font-semibold text-foreground">Premium Monthly</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">
                    Manage
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full h-10 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 rounded-full text-xs"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          /* Portfolio Content (Manual inputs portfolio workflow) */
          <div className="space-y-6">
            {/* CV / Resume upload console */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" /> PDF Resume File
              </h3>
              <div className="flex flex-col gap-3">
                {portfolio?.cvUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate font-medium text-foreground">My_CV_Resume.pdf</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={portfolio.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-primary px-3 py-1.5 bg-primary/10 rounded-full no-underline"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => cvInputRef.current?.click()}
                        disabled={uploadingCV}
                        className="text-[10px] font-bold text-muted-foreground px-3 py-1.5 border border-border rounded-full hover:bg-muted"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => cvInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary rounded-xl py-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-muted/20"
                  >
                    {uploadingCV ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {uploadingCV ? 'Uploading resume...' : 'Upload PDF Resume'}
                    </span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={cvInputRef} 
                  className="hidden" 
                  accept="application/pdf" 
                  onChange={handleCVChange} 
                />
              </div>
            </div>

            {/* GitHub integration box */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                <Github className="w-4 h-4 text-foreground" /> GitHub Integration
              </h3>
              
              {editingGitHub ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="Enter GitHub Username"
                    className="text-xs h-8.5 rounded-xl flex-1"
                  />
                  <Button 
                    onClick={handleSaveGitHub} 
                    disabled={savingGitHub}
                    size="sm" 
                    className="h-8.5 rounded-xl px-3 text-xs"
                  >
                    {savingGitHub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
                  </Button>
                  <Button 
                    onClick={() => setEditingGitHub(false)} 
                    variant="ghost" 
                    size="sm" 
                    className="h-8.5 rounded-xl px-3 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Username:</span>
                    <span className="text-xs font-semibold text-foreground">
                      {portfolio?.githubUsername || 'Not connected'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setGithubInput(portfolio?.githubUsername || '');
                      setEditingGitHub(true);
                    }}
                    className="text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    {portfolio?.githubUsername ? 'Edit' : 'Connect'}
                  </button>
                </div>
              )}
            </div>

            {/* Work Experiences timeline */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" /> Work Experience
                </h3>
                <button
                  onClick={() => {
                    setSelectedExp(null);
                    setIsExpOpen(true);
                  }}
                  className="p-1 hover:bg-muted text-primary rounded-full"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>
              <TimelineView
                experiences={portfolio?.experiences || []}
                isOwner={true}
                onEdit={(exp) => {
                  setSelectedExp(exp);
                  setIsExpOpen(true);
                }}
                onDelete={onDeleteExperience}
              />
            </div>

            {/* Portfolio Projects grid */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-primary" /> Completed Projects
                </h3>
                <button
                  onClick={() => {
                    setSelectedProj(null);
                    setIsProjOpen(true);
                  }}
                  className="p-1 hover:bg-muted text-primary rounded-full"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>

              {portfolio?.projects && portfolio.projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {portfolio.projects.map((proj) => (
                    <div 
                      key={proj.id} 
                      className="p-4 rounded-xl border border-border bg-muted/15 flex flex-col gap-2 relative group hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{proj.title}</h4>
                          {proj.role && <p className="text-[10px] text-muted-foreground mt-0.5">{proj.role}</p>}
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedProj(proj);
                              setIsProjOpen(true);
                            }}
                            className="text-[10px] text-muted-foreground hover:text-primary font-medium"
                          >
                            Edit
                          </button>
                          <span className="text-muted-foreground text-[10px]">&bull;</span>
                          <button
                            onClick={() => onDeleteProject(proj.id!)}
                            className="text-[10px] text-muted-foreground hover:text-destructive font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {proj.description && (
                        <p className="text-[10px] text-foreground/80 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                      <div className="flex gap-3 text-[10px] mt-1.5">
                        {proj.projectUrl && (
                          <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">
                            Demo Link
                          </a>
                        )}
                        {proj.githubRepoUrl && (
                          <a href={proj.githubRepoUrl} target="_blank" rel="noreferrer" className="text-foreground hover:underline font-semibold flex items-center gap-0.5">
                            <Github className="w-3 h-3" /> GitHub Repo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                  No projects added yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialog modals for Portfolio updates */}
      {isExpOpen && (
        <ExperienceFormModal
          isOpen={isExpOpen}
          onClose={() => setIsExpOpen(false)}
          initialData={selectedExp}
          onSubmit={async (data) => {
            await onAddExperience(data);
            setIsExpOpen(false);
          }}
        />
      )}

      {isProjOpen && (
        <ProjectFormModal
          isOpen={isProjOpen}
          onClose={() => setIsProjOpen(false)}
          initialData={selectedProj}
          onSubmit={async (data) => {
            await onAddProject(data);
            setIsProjOpen(false);
          }}
        />
      )}
    </div>
  );
}
