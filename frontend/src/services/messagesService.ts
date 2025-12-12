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

export const messagesService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/conversations');
    return response.data;
  },

  async createConversation(conversationData: CreateConversationData): Promise<Conversation> {
    const response = await api.post('/conversations', conversationData);
    return response.data;
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
};
