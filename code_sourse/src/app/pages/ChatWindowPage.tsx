import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  User, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { 
  fetchChatMessages, 
  sendChatMessage, 
  markMessagesAsRead,
  ChatMessage,
  ChatRoom,
  fetchChatRooms 
} from '../../lib/chat-api';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { MobileContainer } from '../components/MobileContainer';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { toast } from 'sonner';

export function ChatWindowPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { userId, userName } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat room and messages
  useEffect(() => {
    if (!roomId || !userId) return;

    let mounted = true;

    async function loadData() {
      try {
        // Find specific room info from the user's active list
        const activeRooms = await fetchChatRooms(userId);
        const currentRoom = activeRooms.find(r => r.id === roomId);
        
        if (mounted && currentRoom) {
          setRoom(currentRoom);
        }

        const msgs = await fetchChatMessages(roomId!);
        if (mounted) {
          setMessages(msgs);
          setLoading(false);
        }

        // Mark messages in this room as read
        await markMessagesAsRead(roomId!, userId);
      } catch (err: any) {
        toast.error('Failed to load chat thread: ' + err.message);
        if (mounted) setLoading(false);
      }
    }

    loadData();

    // Subscribe to realtime database insertion updates for this room
    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          if (!mounted) return;
          const msg = payload.new as any;
          const newMsg: ChatMessage = {
            id: msg.id,
            roomId: msg.room_id,
            senderId: msg.sender_id,
            recipientId: msg.recipient_id,
            message: msg.message,
            createdAt: msg.created_at,
            isRead: msg.is_read,
          };

          // Append if not duplicates
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Mark incoming message as read if recipient is current user
          if (newMsg.recipientId === userId) {
            await markMessagesAsRead(roomId!, userId);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [roomId, userId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !room || !userId) return;

    setSending(true);
    setNewMessage('');

    // Determine target recipient id
    const recipientId = room.user1Id === userId ? room.user2Id : room.user1Id;

    // Optimistic UI updates
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      roomId: roomId!,
      senderId: userId,
      recipientId,
      message: text,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await sendChatMessage(roomId!, userId, recipientId, text);
    } catch (err: any) {
      toast.error('Message delivery failed');
      // Revert optimistic insert
      setMessages((prev) => prev.filter(m => m.id !== optimistic.id));
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xs">Loading message logs...</span>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative z-10">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <Avatar className="w-9 h-9 border border-border">
              <AvatarImage src={room?.participantImage} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {room?.participantName?.substring(0, 2).toUpperCase() || 'SB'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xs font-bold text-foreground">{room?.participantName}</h3>
              <p className="text-[9px] text-muted-foreground truncate max-w-[170px]">
                {room?.participantProfession}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Bubbles Log */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background/30 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-xs flex flex-col items-center gap-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
            <span>Start your conversation professionally. Keep it career-focused.</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === userId;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[75%] ${isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div 
                  className={`rounded-2xl px-4 py-2.5 text-xs whitespace-pre-line leading-relaxed shadow-sm ${
                    isSelf 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-card border border-border text-foreground rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 px-1">
                  {formatTime(msg.createdAt)} {isSelf && msg.isRead && ' &bull; Read'}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message box footer */}
      <div className="border-t border-border p-4 bg-card safe-area-bottom">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-muted/60 border border-border/80 rounded-full px-4.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          />
          <Button
            type="submit"
            size="icon"
            disabled={sending || !newMessage.trim()}
            className="rounded-full w-9.5 h-9.5 flex items-center justify-center bg-primary text-primary-foreground shrink-0"
          >
            {sending ? (
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
