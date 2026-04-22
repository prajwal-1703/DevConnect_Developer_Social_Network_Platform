import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NewChatDialog } from './NewChatDialog';
import type { Conversation } from '@/services/messagesService';

export function ConversationList() {
  const { user } = useAuth();
  const { conversations, currentConversation, setCurrentConversation } = useMessaging();

  const getOtherParticipant = (conversation: Conversation, currentUserId: string) => {
    if (!conversation.participants) return null;
    return conversation.participants.find(p => String(p.id) !== String(currentUserId)) || conversation.participants[0];
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
                  <AvatarImage src={otherParticipant?.avatar || ''} alt={otherParticipant?.username || ''} />
                  <AvatarFallback>{otherParticipant?.username ? otherParticipant.username[0].toUpperCase() : '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold truncate ${isActive ? 'text-background' : 'text-foreground'}`}>
                      {otherParticipant?.username || 'Unknown'}
                    </p>
                    {conversation.lastMessage && (
                      <span className={`text-[10px] font-medium ${isActive ? 'text-background/70' : 'text-muted-foreground'}`}>
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-[11px] truncate max-w-[150px] leading-tight ${isActive ? 'text-background/80 font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage?.content || 'History empty'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className={`h-5 min-w-[20px] justify-center px-1 rounded-full text-[10px] font-bold ${
                        isActive 
                          ? 'bg-background text-primary border-none' 
                          : 'bg-primary text-background'
                      }`}>
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
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