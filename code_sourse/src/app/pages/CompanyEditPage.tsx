import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Upload, 
  Plus, 
  Trash2,
  Image as ImageIcon 
} from 'lucide-react';
import { Company } from '../types';
import { 
  fetchCompanyDetails, 
  updateCompanyDetails,
  uploadCompanyAsset,
  fetchCompanyMembers
} from '../../lib/company-api';
import { useAuthStore } from '../stores/authStore';
import { MobileContainer } from '../components/MobileContainer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function CompanyEditPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<Partial<Company>>();

  useEffect(() => {
    if (!companyId) return;

    async function verifyAndLoad() {
      try {
        const [companyData, membersData] = await Promise.all([
          fetchCompanyDetails(companyId!),
          fetchCompanyMembers(companyId!)
        ]);

        // Check if user is a member/manager
        const isMember = membersData.some(m => m.userId === userId);
        if (!isMember) {
          toast.error('You do not have permissions to edit this company page.');
          navigate('/home', { replace: true });
          return;
        }

        setCompany(companyData);
        setLogoPreview(companyData.logoUrl || null);
        setCoverPreview(companyData.coverUrl || null);
        
        // Reset form values
        reset({
          name: companyData.name,
          description: companyData.description,
          industry: companyData.industry,
          website: companyData.website,
          email: companyData.email,
          phone: companyData.phone,
          location: companyData.location,
          size: companyData.size,
          foundedDate: companyData.foundedDate
        });
      } catch (err: any) {
        toast.error('Error loading company: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [companyId, userId, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData: Partial<Company>) => {
    if (!company) return;
    setSaving(true);

    try {
      let logoUrl = company.logoUrl;
      let coverUrl = company.coverUrl;

      // 1. Upload assets if modified
      if (logoFile) {
        toast.info('Uploading company logo...');
        logoUrl = await uploadCompanyAsset(company.id, logoFile, 'logo');
      }

      if (coverFile) {
        toast.info('Uploading cover banner...');
        coverUrl = await uploadCompanyAsset(company.id, coverFile, 'cover');
      }

      // 2. Save details updates
      const updated = await updateCompanyDetails(company.id, {
        ...formData,
        logoUrl,
        coverUrl
      });

      toast.success('Company profile updated successfully!');
      navigate(`/company/${company.id}`);
    } catch (err: any) {
      toast.error('Failed to save updates: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Verifying authorization...</span>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-10 bg-background/30">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 py-4 flex items-center gap-3 sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-foreground">Edit Company Details</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-5">
        {/* Cover Preview & File input */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Cover Banner Image
          </label>
          <div className="h-32 bg-muted rounded-xl overflow-hidden relative border border-border flex items-center justify-center">
            {coverPreview ? (
              <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            )}
            <label className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg cursor-pointer flex items-center gap-1 text-[10px] font-bold">
              <Upload className="w-3 h-3" />
              Change Banner
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Logo Preview & File input */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {logoPreview ? (
              <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground/40" />
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Company Logo
            </label>
            <label className="px-3.5 py-1.5 rounded-full border border-border hover:bg-muted text-xs font-semibold cursor-pointer flex items-center gap-1 inline-block">
              <Upload className="w-3.5 h-3.5" />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Details fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Company Name
            </label>
            <Input {...register('name', { required: true })} className="text-xs h-9 rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Industry Sector
            </label>
            <Input {...register('industry', { required: true })} className="text-xs h-9 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                Staff Size
              </label>
              <select
                {...register('size')}
                className="w-full text-xs h-9 border border-border bg-card text-foreground px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                Founded Date
              </label>
              <Input type="date" {...register('foundedDate')} className="text-xs h-9 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Headquarters Location
            </label>
            <Input {...register('location')} className="text-xs h-9 rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              Official Website URL
            </label>
            <Input {...register('website')} className="text-xs h-9 rounded-xl" placeholder="https://example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                Official Email
              </label>
              <Input type="email" {...register('email')} className="text-xs h-9 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
                Phone Number
              </label>
              <Input {...register('phone')} className="text-xs h-9 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">
              About Description
            </label>
            <Textarea {...register('description')} rows={4} className="text-xs rounded-xl" />
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full w-full h-10 mt-3 text-xs flex items-center justify-center gap-1.5 font-bold"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Company Profile</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
