import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PostJobForm } from '../components/PostJobForm';
import { useAuthStore } from '../stores/authStore';
import { useDataStore } from '../stores/dataStore';
import { createJob, triggerNotification } from '../../lib/api';
import { JobAnnouncement } from '../types';

export function PostJobPage() {
  const navigate = useNavigate();
  const { userRole, userName, userEmail } = useAuthStore();
  const { addJob } = useDataStore();

  const handleSubmit = async (job: JobAnnouncement) => {
    try {
      const savedJob = await createJob({
        ...job,
        postedByRole: userRole,
        postedByName: userName,
        postedByEmail: userEmail,
      });
      addJob(savedJob);
      if (savedJob.postStatus === 'approved') {
        toast.success('Job announcement published successfully!');
        triggerNotification('new_job', {
          jobTitle: savedJob.title,
          company: savedJob.company,
          location: savedJob.location,
          deadline: savedJob.applicationDeadline,
        }).catch(() => {});
      } else {
        toast.success('Job announcement submitted for admin review!');
      }
      // Navigate back based on role
      if (userRole === 'trainer') {
        navigate('/trainer/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/trainers');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      toast.error('Failed to post job: ' + err.message);
    }
  };

  const handleClose = () => {
    if (userRole === 'trainer') {
      navigate('/trainer/dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin/trainers');
    } else {
      navigate('/home');
    }
  };

  return (
    <PostJobForm
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
