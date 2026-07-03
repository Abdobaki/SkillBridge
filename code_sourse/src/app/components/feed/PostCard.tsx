import { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  UserPlus, 
  UserMinus, 
  MoreHorizontal, 
  FileText, 
  ExternalLink,
  Crown
} from 'lucide-react';
import { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onFollowToggle: (authorId: string, isCompany: boolean) => void;
  onCommentClick: (post: Post) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLike,
  onSave,
  onFollowToggle,
  onCommentClick,
}: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const authorName = post.company ? post.company.name : post.user?.name || 'SkillBridge User';
  const authorImage = post.company ? post.company.logoUrl : post.user?.profileImage;
  const authorProfession = post.company ? 'Company' : post.user?.profession || 'Professional';
  const isVerified = post.company ? post.company.verified : post.user?.verified;
  
  const isAuthorSelf = post.userId === currentUserId;
  const isCompanyAuthor = !!post.companyId;
  const authorId = post.companyId || post.userId || '';

  const formattedTime = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const renderContent = () => {
    const text = post.content;
    const isLongText = text.length > 280;
    
    // Parse content and highlight hashtags
    const words = text.split(/(\s+)/);
    const parsedText = words.map((word, idx) => {
      if (word.startsWith('#')) {
        return (
          <span key={idx} className="text-primary font-semibold hover:underline cursor-pointer">
            {word}
          </span>
        );
      }
      return word;
    });

    if (isLongText && !isExpanded) {
      return (
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {text.slice(0, 280)}...{' '}
          <button 
            onClick={() => setIsExpanded(true)}
            className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer text-xs"
          >
            Read more
          </button>
        </p>
      );
    }

    return (
      <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
        {parsedText}
        {isExpanded && (
          <button 
            onClick={() => setIsExpanded(false)}
            className="text-primary font-semibold hover:underline bg-transparent border-none p-0 ml-2 cursor-pointer text-xs"
          >
            Show less
          </button>
        )}
      </p>
    );
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11 border border-border">
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {authorName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm hover:underline cursor-pointer text-foreground">
                {authorName}
              </span>
              {isVerified && (
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {authorProfession} &bull; {formattedTime}
            </p>
          </div>
        </div>

        {/* Follow & Options */}
        <div className="flex items-center gap-1">
          {!isAuthorSelf && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFollowToggle(authorId, isCompanyAuthor)}
              className={`h-8 px-2.5 rounded-full flex items-center gap-1 text-xs ${
                post.isFollowingAuthor 
                  ? 'text-muted-foreground hover:bg-muted/50' 
                  : 'text-primary hover:bg-primary/10 font-semibold'
              }`}
            >
              {post.isFollowingAuthor ? (
                <>
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </>
              )}
            </Button>
          )}
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {renderContent()}
      </div>

      {/* Media Carousel */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-border mb-4 bg-muted max-h-[350px] flex items-center justify-center">
          {post.mediaUrls.length === 1 ? (
            <img 
              src={post.mediaUrls[0]} 
              alt="Post attachment" 
              className="w-full h-auto object-cover max-h-[350px]"
            />
          ) : (
            // Simple grid for multiple media files
            <div className="grid grid-cols-2 gap-1 w-full">
              {post.mediaUrls.slice(0, 4).map((url, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img src={url} alt="Post media" className="w-full h-full object-cover" />
                  {idx === 3 && post.mediaUrls.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                      +{post.mediaUrls.length - 4} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attachments Section */}
      {post.attachmentUrls && post.attachmentUrls.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {post.attachmentUrls.map((url, idx) => {
            const fileName = url.split('/').pop()?.split('-').slice(1).join('-') || 'Attachment';
            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors no-underline text-foreground text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-medium truncate max-w-[200px]">{fileName}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/55 pb-3 mb-2.5">
        <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
          <div className="flex items-center -space-x-1">
            <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[9px] text-white">👍</span>
          </div>
          <span>{post.likesCount || 0} Likes</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{post.commentsCount || 0} comments</span>
          <span>{post.sharesCount || 0} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-0.5">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 py-1.5 px-4 rounded-xl text-xs font-semibold hover:bg-muted/50 transition-colors ${
            post.hasLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-primary text-primary' : ''}`} />
          <span>Like</span>
        </button>

        <button
          onClick={() => onCommentClick(post)}
          className="flex items-center gap-2 py-1.5 px-4 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          onClick={() => onSave(post.id)}
          className={`flex items-center gap-2 py-1.5 px-4 rounded-xl text-xs font-semibold hover:bg-muted/50 transition-colors ${
            post.hasSaved ? 'text-amber-600' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.hasSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
