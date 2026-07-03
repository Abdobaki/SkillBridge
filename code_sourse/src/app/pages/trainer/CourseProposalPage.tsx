import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CourseProposalForm } from '../../components/CourseProposalForm';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { saveProposal } from '../../../lib/api';
import { CourseProposal } from '../../types';
import { useState, useEffect } from 'react';

export function CourseProposalPage() {
  const navigate = useNavigate();
  const { userName, userEmail } = useAuthStore();
  const { jobAnnouncements, addProposal, updateProposal } =
    useDataStore();
  const [editingProposal, setEditingProposal] =
    useState<CourseProposal | null>(null);

  // Load editing proposal from sessionStorage if available
  useEffect(() => {
    const stored = sessionStorage.getItem('editingProposal');
    if (stored) {
      try {
        setEditingProposal(JSON.parse(stored));
      } catch {
        // ignore
      }
      sessionStorage.removeItem('editingProposal');
    }
  }, []);

  // Find the job for the proposal
  const jobForProposal = editingProposal
    ? jobAnnouncements.find(
        (j) => j.id === editingProposal.relatedJobId
      ) || null
    : null;

  if (!jobForProposal && !editingProposal) {
    // No job selected — redirect back
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-6 text-center">
        <div>
          <p>No job selected for course proposal.</p>
          <button
            onClick={() => navigate('/trainer/browse-jobs')}
            className="mt-4 text-primary underline"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <CourseProposalForm
      job={jobForProposal!}
      trainerName={userName}
      trainerEmail={userEmail}
      initialData={editingProposal || undefined}
      onClose={() => {
        navigate(
          editingProposal
            ? '/trainer/dashboard'
            : `/job/${jobForProposal?.id}`
        );
      }}
      onSubmit={async (proposal) => {
        try {
          const saved = await saveProposal(proposal);
          if (editingProposal) {
            updateProposal(saved.id, saved);
            toast.success('Course proposal updated successfully!');
          } else {
            addProposal(saved);
            toast.success('Course proposal submitted for review!');
          }
          navigate('/trainer/dashboard');
        } catch (err: any) {
          toast.error('Error: ' + err.message);
        }
      }}
    />
  );
}
