import { supabase } from './supabase';
import { toCamelCase, toSnakeCase } from './api';

export interface ChatRoom {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;

  // Joined metadata for the other participant
  participantName?: string;
  participantImage?: string;
  participantProfession?: string;
  participantEmail?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  recipientId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// ----------------------------------------------------
// CHAT ROOMS CRUD
// ----------------------------------------------------

export async function fetchChatRooms(currentUserId: string): Promise<ChatRoom[]> {
  // Query all rooms where current user is participant 1 or participant 2
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      user1:users!chat_rooms_user1_id_fkey(*),
      user2:users!chat_rooms_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;

  const rawRooms = toCamelCase(data) as any[];

  return rawRooms.map(room => {
    // Identify the other participant
    const isUser1 = room.user1Id === currentUserId;
    const participant = isUser1 ? room.user2 : room.user1;

    return {
      id: room.id,
      user1Id: room.user1Id,
      user2Id: room.user2Id,
      lastMessage: room.lastMessage,
      lastMessageAt: room.lastMessageAt,
      createdAt: room.createdAt,
      participantName: participant?.name || 'SkillBridge User',
      participantImage: participant?.profileImage,
      participantProfession: participant?.profession || 'Professional',
      participantEmail: participant?.email
    };
  });
}

export async function createOrGetChatRoom(
  currentUserId: string,
  targetUserId: string
): Promise<ChatRoom> {
  // Check if room exists between these two users (order does not matter)
  const { data: existing, error: findError } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${currentUserId})`)
    .maybeSingle();

  if (findError) throw findError;

  let roomId: string;
  if (existing) {
    roomId = existing.id;
  } else {
    // Create new room
    const { data: created, error: createError } = await supabase
      .from('chat_rooms')
      .insert({
        user1_id: currentUserId,
        user2_id: targetUserId,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) throw createError;
    roomId = created.id;
  }

  // Fetch full details of the room
  const { data: roomData, error: loadError } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      user1:users!chat_rooms_user1_id_fkey(*),
      user2:users!chat_rooms_user2_id_fkey(*)
    `)
    .eq('id', roomId)
    .single();

  if (loadError) throw loadError;

  const room = toCamelCase(roomData) as any;
  const isUser1 = room.user1Id === currentUserId;
  const participant = isUser1 ? room.user2 : room.user1;

  return {
    id: room.id,
    user1Id: room.user1Id,
    user2Id: room.user2Id,
    lastMessage: room.lastMessage,
    lastMessageAt: room.lastMessageAt,
    createdAt: room.createdAt,
    participantName: participant?.name || 'SkillBridge User',
    participantImage: participant?.profileImage,
    participantProfession: participant?.profession || 'Professional',
    participantEmail: participant?.email
  };
}

// ----------------------------------------------------
// CHAT MESSAGES CRUD
// ----------------------------------------------------

export async function fetchChatMessages(roomId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return toCamelCase(data) as ChatMessage[];
}

export async function sendChatMessage(
  roomId: string,
  senderId: string,
  recipientId: string,
  message: string
): Promise<ChatMessage> {
  // Insert message row
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      recipient_id: recipientId,
      message,
      is_read: false
    })
    .select()
    .single();

  if (error) throw error;

  // Update room last_message metadata
  await supabase
    .from('chat_rooms')
    .update({
      last_message: message,
      last_message_at: new Date().toISOString()
    })
    .eq('id', roomId);

  return toCamelCase(data) as ChatMessage;
}

export async function markMessagesAsRead(roomId: string, currentUserId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .eq('recipient_id', currentUserId)
    .eq('is_read', false);

  if (error) throw error;
}

// ----------------------------------------------------
// UNREAD MESSAGES BADGES
// ----------------------------------------------------

export async function fetchTotalUnreadMessagesCount(currentUserId: string): Promise<number> {
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', currentUserId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
}
