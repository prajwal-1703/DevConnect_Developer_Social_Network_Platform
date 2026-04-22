import { api } from './api';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  text?: string;
  imageUrl?: string;
  codeSnippet?: string;
  isSeen: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    username: string;
    avatar?: string;
  }[];
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationData {
  userId: string;
}

interface BackendUser {
  _id: string;
  username: string;
  profilePicUrl?: string;
}

interface BackendMessage {
  id?: string;
  _id?: string;
  conversationId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  codeSnippet?: string;
  isSeen: boolean;
  createdAt: string;
  sentAt?: string;
}

interface BackendConversation {
  id?: string;
  _id?: string;
  user1Id: BackendUser | string;
  user2Id: BackendUser | string;
  lastMessage?: BackendMessage;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

const mapConversation = (c: BackendConversation): Conversation => {
  console.log('Mapping conversation:', c.id, 'lastMsg:', c.lastMessage);
  const user1 = typeof c.user1Id === 'object' ? c.user1Id : { _id: c.user1Id, username: 'User', profilePicUrl: '' };
  const user2 = typeof c.user2Id === 'object' ? c.user2Id : { _id: c.user2Id, username: 'User', profilePicUrl: '' };

  return {
    id: String(c.id || c._id),
    participants: [
      { id: String(user1._id), username: user1.username || 'User', avatar: user1.profilePicUrl },
      { id: String(user2._id), username: user2.username || 'User', avatar: user2.profilePicUrl },
    ],
    lastMessage: c.lastMessage ? {
      content: (c.lastMessage.text || (c.lastMessage.imageUrl ? '📷 Photo' : (c.lastMessage.codeSnippet ? '💻 Code' : '')) || 'Message').slice(0, 30),
      createdAt: c.lastMessage.createdAt || c.lastMessage.sentAt || new Date().toISOString(),
      senderId: String(c.lastMessage.senderId)
    } : undefined,
    unreadCount: c.unreadCount || 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  };
};

export const messagesService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/conversations');
    const data: BackendConversation[] = response.data || [];
    return data.map(mapConversation);
  },

  async createConversation(conversationData: CreateConversationData): Promise<Conversation> {
    const response = await api.post('/conversations', conversationData);
    return mapConversation(response.data);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },

  async sendMessage(conversationId: string, data: { text?: string; imageUrl?: string; codeSnippet?: string }): Promise<Message> {
    const response = await api.post('/messages', { conversationId, ...data });
    return response.data;
  },

  async markMessageAsSeen(messageId: string): Promise<void> {
    await api.put(`/messages/${messageId}/seen`);
  },

  async markAsRead(conversationId: string): Promise<void> {
    await api.patch(`/conversations/${conversationId}/read`);
  },
};
