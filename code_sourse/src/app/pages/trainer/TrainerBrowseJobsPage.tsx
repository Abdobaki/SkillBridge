import { useNavigate } from 'react-router';
import { TrainerJobBrowseScreen } from '../../components/TrainerJobBrowseScreen';
import { useDataStore } from '../../stores/dataStore';
import { JobAnnouncement } from '../../types';

export function TrainerBrowseJobsPage() {
  const navigate = useNavigate();
  const { jobAnnouncements } = useDataStore();

  const approvedJobs = jobAnnouncements.filter((j) => {
    if (j.postStatus !== 'approved') return false;
    try {
      return new Date(j.applicationDeadline) >= new Date();
    } catch {
      return true;
    }
  });

  return (
    <TrainerJobBrowseScreen
      jobs={approvedJobs}
      onJobClick={(job: JobAnnouncement) => navigate(`/job/${job.id}`)}
      onBack={() => navigate('/trainer/dashboard')}
    />
  );
}
