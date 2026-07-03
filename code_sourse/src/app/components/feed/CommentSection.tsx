import { useState, useEffect } from 'react';
import { 
  Send, 
  CornerDownRight, 
  Loader2, 
  Trash2,
  X 
} from 'lucide-react';
import { PostComment } from '../../types';
import { 
  fetchPostComments, 
  createPostComment 
} from '../../../lib/community-api';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserImage?: string;
  onCommentAdded: () => void;
  onClose: () => void;
}

export function CommentSection({
  postId,
  currentUserId,
  currentUserName,
  currentUserImage,
  onCommentAdded,
  onClose,
}: CommentSectionProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<PostComment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await fetchPostComments(postId);
        setComments(data);
      } catch (err: any) {
        toast.error('Failed to load comments: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [postId]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const payload: Partial<PostComment> = {
        postId,
        userId: currentUserId,
        content: commentText,
        parentId: replyingTo ? replyingTo.id : undefined,
      };

      const newComment = await createPostComment(payload);

      if (replyingTo) {
        // Add to parent comment replies list
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === replyingTo.id) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          })
        );
        setReplyingTo(null);
      } else {
        // Add to main comments list
        setComments((prev) => [...prev, newComment]);
      }

      setCommentText('');
      onCommentAdded();
      toast.success('Comment posted successfully!');
    } catch (err: any) {
      toast.error('Failed to post comment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderCommentRow = (comment: PostComment, isReply = false) => {
    const commenterName = comment.company ? comment.company.name : comment.user?.name || 'User';
    const commenterImage = comment.company ? comment.company.logoUrl : comment.user?.profileImage;
    const formattedTime = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
      <div key={comment.id} className={`flex gap-3 mb-4 ${isReply ? 'ml-9 mt-2 pl-3 border-l-2 border-border/60' : ''}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={commenterImage} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            {commenterName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-muted/50 rounded-2xl px-4 py-2.5 inline-block max-w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-xs text-foreground hover:underline cursor-pointer">
                {commenterName}
              </span>
              <span className="text-[10px] text-muted-foreground">{formattedTime}</span>
            </div>
            <p className="text-xs text-foreground/95 whitespace-pre-line leading-relaxed">
              {comment.content}
            </p>
          </div>

          {!isReply && (
            <div className="flex items-center gap-3 mt-1.5 ml-2">
              <button
                onClick={() => setReplyingTo(comment)}
                className="text-[10px] text-primary hover:underline font-semibold bg-transparent border-none cursor-pointer"
              >
                Reply
              </button>
            </div>
          )}

          {/* Render Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => renderCommentRow(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[500px] bg-card border border-border rounded-t-3xl shadow-xl relative z-50">
      {/* Title */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold flex items-center gap-1.5">
          Comments <span className="text-muted-foreground font-normal">({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</span>
        </h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-xs">
            Be the first to share your thoughts on this post!
          </div>
        ) : (
          comments.map((comment) => renderCommentRow(comment))
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-border p-4 bg-background safe-area-bottom">
        {replyingTo && (
          <div className="flex items-center justify-between bg-primary/5 px-3 py-1.5 rounded-lg mb-2 text-[11px] text-primary font-medium">
            <span className="flex items-center gap-1">
              <CornerDownRight className="w-3 h-3" /> 
              Replying to {replyingTo.company ? replyingTo.company.name : replyingTo.user?.name}
            </span>
            <button 
              onClick={() => setReplyingTo(null)}
              className="p-0.5 hover:bg-primary/10 rounded-full text-primary"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendComment} className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUserImage} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {currentUserName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            className="flex-1 bg-muted/60 border border-border/80 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
          />

          <Button
            type="submit"
            size="icon"
            disabled={submitting || !commentText.trim()}
            className="rounded-full w-8.5 h-8.5 flex items-center justify-center bg-primary text-primary-foreground shrink-0"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
