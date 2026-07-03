import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  Phone, 
  Mail, 
  Plus, 
  Check, 
  Crown,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import { Company } from '../../types';
import { Button } from '../ui/button';

interface CompanyHeaderProps {
  company: Company;
  isFollowing: boolean;
  onFollowToggle: () => void;
  isManager: boolean;
  onEditClick?: () => void;
}

export function CompanyHeader({
  company,
  isFollowing,
  onFollowToggle,
  isManager,
  onEditClick,
}: CompanyHeaderProps) {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await onFollowToggle();
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter':
      case 'x': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-card border-b border-border relative">
      {/* Cover image banner */}
      <div className="h-36 sm:h-44 bg-gradient-to-r from-primary/30 to-primary/10 relative overflow-hidden">
        {company.coverUrl ? (
          <img 
            src={company.coverUrl} 
            alt={`${company.name} cover`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Building2 className="w-24 h-24 text-primary" />
          </div>
        )}
      </div>

      {/* Meta Container */}
      <div className="px-6 pb-6 pt-16 relative">
        {/* Logo Overlap */}
        <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-card bg-card shadow-md overflow-hidden flex items-center justify-center">
          {company.logoUrl ? (
            <img 
              src={company.logoUrl} 
              alt={`${company.name} logo`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-12 h-12 text-muted-foreground/60" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute right-6 top-4 flex items-center gap-2">
          {isManager ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="rounded-full px-4 h-8 text-xs font-semibold"
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              disabled={loading}
              onClick={handleFollow}
              className="rounded-full px-5 h-8 text-xs font-semibold flex items-center gap-1"
            >
              {isFollowing ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Name and headline details */}
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {company.name}
            </h1>
            {company.verified && (
              <Crown 
                className={`w-4 h-4 ${
                  company.verificationType === 'startup' 
                    ? 'text-emerald-500 fill-emerald-500' 
                    : 'text-primary fill-primary'
                }`}
                title={company.verificationType === 'startup' ? 'Verified Startup' : 'Verified Company'}
              />
            )}
          </div>
          <p className="text-xs text-primary font-semibold mt-1">
            {company.industry}
          </p>
        </div>

        {/* Meta badges row */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-[11px] text-muted-foreground">
          {company.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{company.location}</span>
            </div>
          )}
          {company.size && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{company.size} employees</span>
            </div>
          )}
          {company.foundedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Founded {new Date(company.foundedDate).getFullYear()}</span>
            </div>
          )}
          {company.website && (
            <a 
              href={company.website} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-primary hover:underline"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{company.website.replace(/(^\w+:|^)\/\//, '')}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
          )}
        </div>

        {/* Contact links list */}
        <div className="flex flex-wrap gap-4 border-t border-border/60 pt-4 mt-4 text-[11px] text-muted-foreground">
          {company.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{company.email}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{company.phone}</span>
            </div>
          )}
        </div>

        {/* Social media connections */}
        {company.socialLinks && Object.keys(company.socialLinks).length > 0 && (
          <div className="flex items-center gap-2 mt-4 border-t border-border/60 pt-4">
            {Object.entries(company.socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title={platform}
              >
                {getSocialIcon(platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
