import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  MessageSquare, 
  Search, 
  Loader2, 
  Plus,
  Inbox,
  User,
  Compass
} from 'lucide-react';
import { fetchChatRooms, ChatRoom } from '../../lib/chat-api';
import { useAuthStore } from '../stores/authStore';
import { MobileContainer } from '../components/MobileContainer';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export function ChatRoomsPage() {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userId) return;
    async function loadRooms() {
      try {
        const data = await fetchChatRooms(userId);
        setRooms(data);
      } catch (err: any) {
        toast.error('Failed to load chat channels: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, [userId]);

  const filteredRooms = rooms.filter(room => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      room.participantName?.toLowerCase().includes(q) ||
      room.participantProfession?.toLowerCase().includes(q) ||
      room.lastMessage?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Loading conversations...</span>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background/30 overflow-y-auto pb-10 scrollbar-hide">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 py-4 flex items-center gap-3 sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-foreground">Direct Messages</h2>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-card border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages or contacts..."
            className="pl-10 text-xs h-9.5 rounded-xl bg-muted/40 border-border/80"
          />
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 px-4 py-3">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
            <Inbox className="w-12 h-12 text-muted-foreground/45" />
            <div>
              <p className="font-semibold text-foreground text-sm">No messages yet</p>
              <p className="text-[10px] mt-0.5">Start direct messaging from job applicant reviews or profile pages.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredRooms.map((room) => {
              const formattedTime = room.lastMessageAt
                ? formatDistanceToNow(new Date(room.lastMessageAt), { addSuffix: false })
                : '';

              return (
                <div
                  key={room.id}
                  onClick={() => navigate(`/chats/${room.id}`)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-border/70 hover:border-primary/45 hover:bg-muted/20 transition-all cursor-pointer bg-card shadow-sm"
                >
                  <Avatar className="w-11 h-11 border border-border">
                    <AvatarImage src={room.participantImage} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {room.participantName?.substring(0, 2).toUpperCase() || 'SB'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-foreground truncate max-w-[150px]">
                        {room.participantName}
                      </h4>
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase">
                        {formattedTime}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-primary font-semibold truncate mb-1">
                      {room.participantProfession}
                    </p>

                    <p className="text-[10px] text-muted-foreground truncate leading-relaxed">
                      {room.lastMessage || 'Open thread to start messaging...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
