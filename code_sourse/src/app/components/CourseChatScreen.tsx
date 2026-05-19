import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, GraduationCap, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '../../lib/supabase';
import { CourseMessage, fetchCourseMessages, sendCourseMessage } from '../../lib/api';
import { toast } from 'sonner';

interface CourseChatScreenProps {
  courseId: string;
  courseTitle: string;
  userEmail: string;
  userName: string;
  isInstructor: boolean;
  enrolledCount?: number;
  onBack: () => void;
}

export function CourseChatScreen({
  courseId,
  courseTitle,
  userEmail,
  userName,
  isInstructor,
  enrolledCount = 0,
  onBack,
}: CourseChatScreenProps) {
  const [messages, setMessages] = useState<CourseMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    let mounted = true;
    fetchCourseMessages(courseId)
      .then((msgs) => { if (mounted) { setMessages(msgs); setIsLoading(false); } })
      .catch(() => { if (mounted) setIsLoading(false); });

    // Subscribe to realtime new messages
    const channel = supabase
      .channel(`course-chat-${courseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'course_messages',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          if (!mounted) return;
          const msg = payload.new as any;
          const newMsg: CourseMessage = {
            id: msg.id,
            courseId: msg.course_id,
            senderEmail: msg.sender_email,
            senderName: msg.sender_name,
            isInstructor: msg.is_instructor,
            message: msg.message,
            createdAt: msg.created_at,
          };
          // Avoid duplicate if we already added it optimistically
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [courseId]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) return;

    setIsSending(true);
    setNewMessage('');

    // Optimistic UI
    const optimistic: CourseMessage = {
      id: `temp-${Date.now()}`,
      courseId,
      senderEmail: userEmail,
      senderName: userName,
      isInstructor,
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await sendCourseMessage(courseId, userEmail, userName, text, isInstructor);
    } catch {
      toast.error('Failed to send message');
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setNewMessage(text);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Group messages by day
  type GroupedMessage = { dateLabel: string; msgs: CourseMessage[] };
  const grouped = messages.reduce<GroupedMessage[]>((acc, msg) => {
    const label = formatDate(msg.createdAt);
    const last = acc[acc.length - 1];
    if (last && last.dateLabel === label) {
      last.msgs.push(msg);
    } else {
      acc.push({ dateLabel: label, msgs: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-gradient-to-br from-primary to-primary/80 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 shrink-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold truncate">{courseTitle}</h2>
          <p className="text-white/70 text-xs mt-0.5">
            {enrolledCount} member{enrolledCount !== 1 ? 's' : ''} · Course Chat
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-foreground mb-2">No messages yet</h4>
            <p className="text-sm text-muted-foreground">
              Be the first to say something!
            </p>
          </div>
        ) : (
          grouped.map(({ dateLabel, msgs }) => (
            <div key={dateLabel}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground px-2">{dateLabel}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                {msgs.map((msg) => {
                  const isOwn = msg.senderEmail === userEmail;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}
                    >
                      {/* Avatar (others only) */}
                      {!isOwn && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                          msg.isInstructor
                            ? 'bg-accent text-white'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {msg.isInstructor
                            ? <GraduationCap className="w-4 h-4" />
                            : msg.senderName.charAt(0).toUpperCase()
                          }
                        </div>
                      )}

                      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                        {/* Sender name + instructor badge */}
                        {!isOwn && (
                          <div className="flex items-center gap-1.5 mb-1 ml-1">
                            <span className="text-xs font-medium text-foreground">
                              {msg.senderName}
                            </span>
                            {msg.isInstructor && (
                              <span className="text-[10px] bg-accent/15 text-accent font-semibold px-1.5 py-0.5 rounded-full">
                                Instructor
                              </span>
                            )}
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : msg.isInstructor
                              ? 'bg-accent/15 text-foreground border border-accent/30 rounded-bl-sm'
                              : 'bg-card border border-border text-foreground rounded-bl-sm'
                          }`}
                        >
                          {msg.message}
                        </div>

                        {/* Time */}
                        <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-card border-t border-border">
        <div className="flex gap-3 items-center">
          {isInstructor && (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
          )}
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isInstructor ? 'Message as instructor...' : 'Type a message...'}
            className="flex-1 h-11"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            size="icon"
            className="h-11 w-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
