import { Briefcase, Calendar, MapPin, Trash2, Edit } from 'lucide-react';
import { PortfolioExperience } from '../../../lib/portfolio-api';
import { format } from 'date-fns';

interface TimelineViewProps {
  experiences: PortfolioExperience[];
  isOwner: boolean;
  onEdit: (exp: PortfolioExperience) => void;
  onDelete: (id: string) => void;
}

export function TimelineView({
  experiences,
  isOwner,
  onEdit,
  onDelete,
}: TimelineViewProps) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-xs bg-muted/10 border border-dashed border-border rounded-xl">
        No work experience or education added yet.
      </div>
    );
  }

  const formatPeriod = (start: string, end?: string) => {
    try {
      const startDate = format(new Date(start), 'MMM yyyy');
      const endDate = end ? format(new Date(end), 'MMM yyyy') : 'Present';
      return `${startDate} - ${endDate}`;
    } catch {
      return `${start} - ${end || 'Present'}`;
    }
  };

  return (
    <div className="relative pl-6 border-l-2 border-border/80 ml-3 space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="relative group">
          {/* Bullet Dot */}
          <div className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-card border-2 border-primary flex items-center justify-center">
            <Briefcase className="w-2.5 h-2.5 text-primary" />
          </div>

          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {exp.role}
                </h4>
                <p className="text-[10px] text-primary font-semibold mt-0.5">
                  {exp.companyName}
                </p>
                
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatPeriod(exp.startDate, exp.endDate)}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Edit/Delete */}
              {isOwner && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(exp)}
                    className="p-1 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg"
                    title="Edit Experience"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(exp.id!)}
                    className="p-1 hover:bg-muted text-muted-foreground hover:text-destructive rounded-lg"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {exp.description && (
              <p className="text-[10px] text-foreground/80 mt-3 whitespace-pre-line leading-relaxed">
                {exp.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
