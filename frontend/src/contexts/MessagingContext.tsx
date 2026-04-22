import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { messagesService } from '@/services/messagesService';
import type { Conversation, Message } from '@/services/messagesService';

// Using types from messagesService

interface MessagingContextType {
  socket: Socket | null;
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  isConnected: boolean;
  sendMessage: (content: string, type?: 'text' | 'image' | 'code') => void;
  setCurrentConversation: (id: string | null) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (conversation: Conversation) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversationState] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      if (isAuthenticated) {
        try {
          const conversationsData = await messagesService.getConversations();
          setConversations(conversationsData);
        } catch (error) {
          console.error('Failed to load conversations:', error);
        }
      }
    };

    loadConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const newSocket = io(socketUrl, {
        auth: {
          token: localStorage.getItem('devconnect-token'),
        },
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to messaging server');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from messaging server');
      });

      newSocket.on('newMessage', (message: Message) => {
        setMessages(prev => [...prev, message]);
        // Update conversations with new message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === message.conversationId
              ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + 1 }
              : conv
          )
        );
      });

      newSocket.on('messageDelivered', (messageId: string) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isSeen: true } : msg
          )
        );
      });

      newSocket.on('messageRead', (messageId: string) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isSeen: true } : msg
          )
        );
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = React.useCallback(async (content: string, type: 'text' | 'image' | 'code' = 'text') => {
    if (currentConversation) {
      try {
        let messageField = {};
        if (type === 'text') messageField = { text: content };
        else if (type === 'image') messageField = { imageUrl: content };
        else if (type === 'code') messageField = { codeSnippet: content };

        const newMessage = await messagesService.sendMessage(currentConversation, messageField);
        setMessages(prev => [...prev, newMessage]);
        
        // Map message to lastMessage shape
        const lastMsgDesc = newMessage.text || (newMessage.imageUrl ? '📷 Photo' : (newMessage.codeSnippet ? '💻 Code' : ''));
        
        // Update conversation with new message
        setConversations(prev => 
          prev.map(conv => {
            if (conv.id === currentConversation) {
              return { 
                ...conv, 
                lastMessage: { content: lastMsgDesc, createdAt: newMessage.createdAt, senderId: newMessage.senderId } 
              };
            }
            return conv;
          })
        );
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }, [currentConversation]);

  const setCurrentConversation = React.useCallback(async (id: string | null) => {
    setCurrentConversationState(id);
    if (id) {
      try {
        // Mark as read asynchronously and don't await to avoid blocking message fetch
        messagesService.markAsRead(id).catch(e => console.error("Mark read failed:", e));
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
        
        const messagesData = await messagesService.getMessages(id);
        setMessages(messagesData);
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, []);

  const markAsRead = React.useCallback(async (conversationId: string) => {
    try {
      await messagesService.markAsRead(conversationId);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, []);

  const createConversation = React.useCallback(async (conversation: Conversation) => {
    setConversations(prev => {
      const exists = prev.find(c => c.id === conversation.id);
      if (exists) return prev;
      return [conversation, ...prev];
    });
    setCurrentConversationState(conversation.id);
    if (!conversation.id) {
      console.error('Conversation object missing id:', conversation);
      setMessages([]);
      return;
    }
    try {
      const messagesData = await messagesService.getMessages(conversation.id);
      setMessages(messagesData);
    } catch (error) {
      setMessages([]);
    }
  }, []);

  const value = {
    socket,
    conversations,
    currentConversation,
    messages,
    isConnected,
    sendMessage,
    setCurrentConversation,
    markAsRead,
    createConversation,
  };

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};