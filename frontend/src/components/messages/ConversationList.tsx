import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { type Conversation } from '@/services/messagesService';
import { NewChatDialog } from './NewChatDialog';

export function ConversationList() {
  const { user } = useAuth();
  const { conversations, currentConversation, setCurrentConversation } = useMessaging();

  const getOtherParticipant = (conversation: any, currentUserId: string) => {
    if (!conversation.user1Id || !conversation.user2Id) return null;
    // user1Id and user2Id are populated objects
    return conversation.user1Id._id === currentUserId ? conversation.user2Id : conversation.user1Id;
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="p-4 border-b space-y-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <NewChatDialog />
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation, user?.id);
            const isActive = currentConversation === conversation.id;

            if (!otherParticipant) return null;

            return (
              <div
                key={conversation.id}
                onClick={() => setCurrentConversation(conversation.id)}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                  }`}
              >
                <Avatar>
                  <AvatarImage src={otherParticipant?.profilePicUrl || ''} alt={otherParticipant?.username || ''} />
                  <AvatarFallback>{otherParticipant?.username ? otherParticipant.username[0].toUpperCase() : '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{otherParticipant?.username || 'Unknown'}</p>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="secondary" className="mt-1">
                      {conversation.unreadCount} new
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
          {conversations.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No conversations yet
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}