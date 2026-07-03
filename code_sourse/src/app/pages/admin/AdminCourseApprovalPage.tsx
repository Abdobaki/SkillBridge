import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AdminApprovalScreen } from '../../components/AdminApprovalScreen';
import { useDataStore } from '../../stores/dataStore';
import {
  updateProposalStatus,
  createCourse,
  triggerNotification,
} from '../../../lib/api';
import { Course } from '../../types';

export function AdminCourseApprovalPage() {
  const navigate = useNavigate();
  const { courseProposals, updateProposal, addCourse } = useDataStore();

  return (
    <AdminApprovalScreen
      proposals={courseProposals}
      onBack={() => navigate('/admin/trainers')}
      onApprove={async (proposalId) => {
        try {
          const proposal = courseProposals.find(
            (p) => p.id === proposalId
          );
          if (!proposal) throw new Error('Proposal not found');

          const updated = await updateProposalStatus(
            proposalId,
            'approved'
          );
          updateProposal(proposalId, updated);

          // Create the course
          const newCourseData: Partial<Course> = {
            title: proposal.courseTitle,
            instructor: proposal.trainerName,
            instructorBio: proposal.instructorBio,
            price: proposal.finalPrice,
            enrolled: 0,
            description: proposal.courseDescription,
            duration: proposal.duration,
            category: 'Professional',
            verified: true,
            relatedJobId: proposal.relatedJobId,
            status: 'active',
            minEnrollment: proposal.minStudents,
          };

          const createdCourse = await createCourse(newCourseData);
          addCourse(createdCourse);

          toast.success(
            'Course proposal approved and published to courses!'
          );
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
      onReject={async (proposalId, feedback) => {
        try {
          const updated = await updateProposalStatus(
            proposalId,
            'rejected',
            feedback
          );
          updateProposal(proposalId, updated);
          toast.info(
            'Course proposal rejected with feedback sent to trainer.'
          );
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
    />
  );
}
