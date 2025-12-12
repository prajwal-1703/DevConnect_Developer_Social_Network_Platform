import React, { useEffect, useRef, useState } from 'react';
import { Send, Image, Code, Copy, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { uploadService } from '@/services/uploadService';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function ChatBox() {
  const { user } = useAuth();
  const { currentConversation, messages, sendMessage, markAsRead } = useMessaging();
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'image' | 'code'>('text');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastCopiedId, setLastCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is open
  useEffect(() => {
    if (currentConversation) {
      markAsRead(currentConversation);
    }
  }, [currentConversation, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageType !== 'image' && !newMessage.trim()) return;

    try {
      if (messageType === 'image') {
        if (!selectedImage) return;
        setIsUploading(true);
        const { imageUrl } = await uploadService.uploadImage(selectedImage);
        await sendMessage(imageUrl, 'image');
        setSelectedImage(null);
      } else {
        await sendMessage(newMessage, messageType);
      }
      setNewMessage('');
      setMessageType('text');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Debug: Log current messages array
  console.log('messages:', messages);

  if (!currentConversation) {
    return (
      <Card className="h-[calc(100vh-12rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, idx) => {
            const isSentByMe = message.senderId === user?.id;
            // Defensive: ensure sender object exists
            const sender = message.sender || { username: "Unknown", avatar: "", id: "" };
            console.log('message fields', message.id, message.text, message.imageUrl, message.codeSnippet);
            return (
              <div
                key={message.id || idx}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[70%]">
                  {!isSentByMe && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sender.avatar} alt={sender.username} />
                      <AvatarFallback>
                        {sender.username[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {!isSentByMe && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {sender.username}
                      </p>
                    )}
                    <div
                      className={`rounded-lg p-3 border border-red-500 ${
                        isSentByMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.text && (
                        <p className="break-words">{message.text}</p>
                      )}
                      {message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt="Image message"
                          className="max-w-full max-h-48 rounded-md my-1 border cursor-pointer"
                          onClick={() => setPreviewUrl(message.imageUrl || '')}
                        />
                      )}
                      {message.codeSnippet && (
                        <div className="relative group">
                          <pre className="bg-gray-900 text-green-200 rounded p-2 pr-10 my-1 overflow-x-auto text-sm">
                            <code>{message.codeSnippet}</code>
                          </pre>
                          <button
                            type="button"
                            className={`absolute top-2 right-2 p-1 rounded border transition-opacity ${
                              isSentByMe ? 'bg-primary/20' : 'bg-black/20'
                            }`}
                            aria-label="Copy code"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(message.codeSnippet || '');
                                setLastCopiedId(message.id || String(idx));
                                setTimeout(() => setLastCopiedId((prev) => (prev === (message.id || String(idx)) ? null : prev)), 1500);
                              } catch (e) {
                                console.error('Copy failed', e);
                              }
                            }}
                          >
                            {lastCopiedId === (message.id || String(idx)) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                      {!message.text && !message.imageUrl && !message.codeSnippet && (
                        <p className="text-red-500">[No content]</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      {message.isSeen && isSentByMe && ' • Seen'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t flex items-end gap-2">
        <div className="flex-1 space-y-2">
          {messageType === 'image' ? (
            <div className="flex items-center justify-between gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />
              {selectedImage && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedImage.name}
                </span>
              )}
            </div>
          ) : (
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={messageType === 'code' ? 'Write code snippet…' : 'Type a message…'}
              className={`min-h-[80px] ${messageType === 'code' ? 'font-mono' : ''}`}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant={messageType === 'image' ? 'default' : 'ghost'}
            onClick={() => setMessageType(messageType === 'image' ? 'text' : 'image')}
            disabled={isUploading}
            aria-label="Toggle image message"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={messageType === 'code' ? 'default' : 'ghost'}
            onClick={() => setMessageType(messageType === 'code' ? 'text' : 'code')}
            disabled={isUploading}
            aria-label="Toggle code snippet"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button type="submit" size="icon" disabled={isUploading || (messageType === 'image' ? !selectedImage : !newMessage.trim())} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}