import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ProfileScreen } from '../components/ProfileScreen';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { supabase } from '../../lib/supabase';
import {
  signOutUser,
  updateUserProfile,
  uploadProfileImage,
} from '../../lib/api';
import {
  fetchUserPortfolio,
  createOrUpdatePortfolio,
  savePortfolioExperience,
  deletePortfolioExperience,
  savePortfolioProject,
  deletePortfolioProject,
  uploadPortfolioCV,
  UserPortfolio,
  PortfolioExperience,
  PortfolioProject,
} from '../../lib/portfolio-api';

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    userName,
    userEmail,
    userProfession,
    userType,
    profileImage,
    userId,
    setAuth,
  } = useAuthStore();
  const { savedItems, appliedJobIds, enrollments } = useDataStore();
  
  // Local portfolio state
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    async function loadPortfolio() {
      try {
        const data = await fetchUserPortfolio(userId);
        setPortfolio(data);
      } catch (err: any) {
        console.error('Failed to load portfolio:', err);
      }
    }
    loadPortfolio();
  }, [userId]);

  const handleUpdateProfile = async (data: {
    name: string;
    profession: string;
    imageFile?: File;
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let imageUrl = profileImage;
      if (data.imageFile) {
        imageUrl = await uploadProfileImage(user.id, data.imageFile);
      }

      const updatedProfile = await updateUserProfile(user.id, {
        name: data.name,
        profession: data.profession,
        profileImage: imageUrl,
      });

      setAuth({
        userName: updatedProfile.name,
        userProfession: updatedProfile.profession,
        profileImage: updatedProfile.profileImage,
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update profile: ' + err.message);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch {
      // ignore
    }
  };

  // ----------------------------------------------------
  // PORTFOLIO MUTATION CALLBACKS
  // ----------------------------------------------------

  const handleAddExperience = async (exp: PortfolioExperience) => {
    try {
      // Ensure portfolio exists first
      let currentPortfolio = portfolio;
      if (!currentPortfolio) {
        currentPortfolio = await createOrUpdatePortfolio(userId, {});
      }

      const savedExp = await savePortfolioExperience(currentPortfolio.id, exp);
      
      setPortfolio((prev) => {
        if (!prev) return currentPortfolio;
        const exists = prev.experiences?.some((e) => e.id === savedExp.id);
        const nextExperiences = exists
          ? prev.experiences?.map((e) => (e.id === savedExp.id ? savedExp : e))
          : [...(prev.experiences || []), savedExp];
        return {
          ...prev,
          experiences: nextExperiences,
        };
      });
      
      toast.success(exp.id ? 'Experience updated.' : 'Experience added.');
    } catch (err: any) {
      toast.error('Failed to save experience: ' + err.message);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deletePortfolioExperience(id);
      setPortfolio((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          experiences: prev.experiences?.filter((e) => e.id !== id),
        };
      });
      toast.success('Experience deleted.');
    } catch (err: any) {
      toast.error('Failed to delete experience: ' + err.message);
    }
  };

  const handleAddProject = async (proj: PortfolioProject) => {
    try {
      let currentPortfolio = portfolio;
      if (!currentPortfolio) {
        currentPortfolio = await createOrUpdatePortfolio(userId, {});
      }

      const savedProj = await savePortfolioProject(currentPortfolio.id, proj);
      
      setPortfolio((prev) => {
        if (!prev) return currentPortfolio;
        const exists = prev.projects?.some((p) => p.id === savedProj.id);
        const nextProjects = exists
          ? prev.projects?.map((p) => (p.id === savedProj.id ? savedProj : p))
          : [...(prev.projects || []), savedProj];
        return {
          ...prev,
          projects: nextProjects,
        };
      });

      toast.success(proj.id ? 'Project updated.' : 'Project added.');
    } catch (err: any) {
      toast.error('Failed to save project: ' + err.message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deletePortfolioProject(id);
      setPortfolio((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          projects: prev.projects?.filter((p) => p.id !== id),
        };
      });
      toast.success('Project deleted.');
    } catch (err: any) {
      toast.error('Failed to delete project: ' + err.message);
    }
  };

  const handleUploadCV = async (file: File) => {
    try {
      const cvUrl = await uploadPortfolioCV(userId, file);
      
      // Update portfolio metadata
      const updated = await createOrUpdatePortfolio(userId, { cvUrl });
      
      setPortfolio((prev) => {
        if (!prev) return updated;
        return {
          ...prev,
          cvUrl: updated.cvUrl,
        };
      });
    } catch (err: any) {
      throw err;
    }
  };

  const handleSaveGitHub = async (username: string) => {
    try {
      const updated = await createOrUpdatePortfolio(userId, {
        githubUsername: username,
      });
      setPortfolio((prev) => {
        if (!prev) return updated;
        return {
          ...prev,
          githubUsername: updated.githubUsername,
        };
      });
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <ProfileScreen
      userName={userName}
      userEmail={userEmail}
      userProfession={userProfession}
      userType={userType}
      profileImage={profileImage}
      savedItemsCount={savedItems.length}
      appliedJobsCount={appliedJobIds.length}
      coursesCount={
        enrollments.filter((e) => e.studentEmail === userEmail).length
      }
      portfolio={portfolio}
      onUpgrade={() => navigate('/subscription')}
      onLogout={handleLogout}
      onSavedClick={() => navigate('/saved')}
      onAppliedClick={() => navigate('/applied')}
      onCoursesClick={() => navigate('/courses')}
      onUpdateProfile={handleUpdateProfile}
      onSettingsClick={() => navigate('/settings')}
      onAddExperience={handleAddExperience}
      onDeleteExperience={handleDeleteExperience}
      onAddProject={handleAddProject}
      onDeleteProject={handleDeleteProject}
      onUploadCV={handleUploadCV}
      onSaveGitHub={handleSaveGitHub}
    />
  );
}
