import { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Paperclip, 
  Smile, 
  Globe, 
  FileText,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { uploadPostMedia } from '../../../lib/community-api';
import { PostType } from '../../types';

const POST_TYPES: { val: PostType; label: string }[] = [
  { val: 'general', label: 'General Announcement' },
  { val: 'project', label: 'Completed Project' },
  { val: 'portfolio', label: 'Portfolio Share' },
  { val: 'certificate', label: 'Certificate Earned' },
  { val: 'achievement', label: 'University Achievement' },
  { val: 'internship', label: 'Internship Experience' },
  { val: 'job', label: 'New Job Offer' },
  { val: 'promotion', label: 'Career Promotion' },
  { val: 'article', label: 'Technical Article' },
  { val: 'advice', label: 'Career Advice' },
  { val: 'question', label: 'Ask a Question' },
];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  profileImage?: string;
  onPostCreated: (post: {
    content: string;
    mediaUrls: string[];
    attachmentUrls: string[];
    hashtags: string[];
  }) => Promise<void>;
}

export function CreatePostModal({
  isOpen,
  onClose,
  userId,
  userName,
  profileImage,
  onPostCreated,
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('general');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Max 5 media files
      if (mediaFiles.length + files.length > 5) {
        toast.warning('You can upload a maximum of 5 media files.');
        return;
      }
      setMediaFiles((prev) => [...prev, ...files]);
    }
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (attachmentFiles.length + files.length > 3) {
        toast.warning('You can attach a maximum of 3 files.');
        return;
      }
      setAttachmentFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveMedia = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const parseHashtags = (text: string): string[] => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    return matches ? matches.map((match) => match.substring(1).toLowerCase()) : [];
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Post content cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    const mediaUrls: string[] = [];
    const attachmentUrls: string[] = [];

    try {
      // 1. Upload Media
      if (mediaFiles.length > 0) {
        toast.info('Uploading media files...');
        for (const file of mediaFiles) {
          const url = await uploadPostMedia(userId, file);
          mediaUrls.push(url);
        }
      }

      // 2. Upload Attachments
      if (attachmentFiles.length > 0) {
        toast.info('Uploading attachments...');
        for (const file of attachmentFiles) {
          const url = await uploadPostMedia(userId, file);
          attachmentUrls.push(url);
        }
      }

      // 3. Extract Hashtags
      const hashtags = parseHashtags(content);

      // 4. Create Post
      await onPostCreated({
        content,
        mediaUrls,
        attachmentUrls,
        hashtags,
      });

      // Clear form
      setContent('');
      setMediaFiles([]);
      setAttachmentFiles([]);
      setPostType('general');
      toast.success('Post published successfully!');
      onClose();
    } catch (err: any) {
      toast.error('Failed to create post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[460px] max-h-[90vh] overflow-y-auto rounded-3xl p-5 gap-0">
        <DialogHeader className="border-b border-border pb-3 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold">Create Post</DialogTitle>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* User Info & Post Type */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {userName.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-semibold">{userName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as PostType)}
                className="text-[11px] bg-muted/60 border border-border/80 px-2 py-1 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                {POST_TYPES.map((type) => (
                  <option key={type.val} value={type.val}>
                    {type.label}
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground text-[10px] flex items-center gap-0.5">
                <Globe className="w-3 h-3" /> Anyone
              </span>
            </div>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your latest project, certificates, new jobs, or promotions..."
          className="w-full min-h-[120px] bg-transparent text-sm resize-none focus:outline-none placeholder-muted-foreground text-foreground mb-4"
          maxLength={3000}
        />

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-muted/30 rounded-xl border border-border/50">
            {mediaFiles.map((file, idx) => {
              const objectUrl = URL.createObjectURL(file);
              return (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={objectUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveMedia(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Attachments Preview */}
        {attachmentFiles.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {attachmentFiles.map((file, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 bg-muted/50 rounded-xl border border-border text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                </div>
                <button
                  onClick={() => handleRemoveAttachment(idx)}
                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              accept="image/*"
              multiple
              ref={mediaInputRef}
              onChange={handleMediaSelect}
              className="hidden"
            />
            <button
              onClick={() => mediaInputRef.current?.click()}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              title="Add Image"
            >
              <ImageIcon className="w-4.5 h-4.5" />
            </button>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip"
              multiple
              ref={attachmentInputRef}
              onChange={handleAttachmentSelect}
              className="hidden"
            />
            <button
              onClick={() => attachmentInputRef.current?.click()}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
            className="rounded-full px-5 h-9 text-xs flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing</span>
              </>
            ) : (
              <span>Publish</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
