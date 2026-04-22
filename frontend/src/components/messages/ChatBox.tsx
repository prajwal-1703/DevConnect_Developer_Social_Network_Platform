import React, { useEffect, useRef, useState } from 'react';
import { Send, Image, Code, Copy, Check, Eye, Loader2, X } from 'lucide-react';
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
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
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
  }, [currentConversation, messages, markAsRead]);

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
  console.log('Rendering ChatBox messages array:', messages);

  if (!user) return null;

  if (!currentConversation) {
    return (
      <Card className="h-[calc(100vh-12rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col border-primary/10 bg-panel/20 backdrop-blur-sm">
      {/* DBG */}
      <div className="absolute top-0 right-0 text-[10px] text-muted-foreground p-1 z-50">msgs: {messages?.length}</div>
      <ScrollArea className="flex-1 p-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm italic">No messages in this conversation yet</p>
          </div>
        ) : (
          <div className="space-y-6">
          {messages.map((message, idx) => {
            const senderIdFromMsg = message.senderId || message.sender?.id;
            const isSentByMe = senderIdFromMsg === user?.id;
            const sender = message.sender || { username: "Unknown", avatar: "", id: "" };
            
            return (
              <div
                key={message.id || idx}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${isSentByMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage src={sender.avatar} alt={sender.username} />
                    <AvatarFallback className="bg-muted text-xs">
                      {sender.username[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`relative group rounded-2xl p-4 transition-all duration-200 border ${
                        isSentByMe
                          ? 'bg-primary text-background border-primary/20 rounded-tr-none'
                          : 'bg-muted/50 text-foreground border-border/50 rounded-tl-none'
                      }`}
                    >
                      {message.text && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      )}
                      
                      {message.imageUrl && (
                        <div className="relative mt-2 group/img overflow-hidden rounded-lg">
                          <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="max-w-full max-h-72 object-cover transition-transform duration-500 group-hover/img:scale-110 cursor-pointer"
                            onClick={() => setPreviewUrl(message.imageUrl || '')}
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {message.codeSnippet && (
                        <div className="relative mt-2 overflow-hidden rounded-lg border border-white/10">
                          <div className="bg-black/50 px-3 py-1 flex items-center justify-between border-b border-white/5">
                            <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">Snippet</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(message.codeSnippet || '');
                                setLastCopiedId(message.id || String(idx));
                                setTimeout(() => setLastCopiedId(null), 2000);
                              }}
                              className="text-white/40 hover:text-white transition-colors"
                            >
                              {lastCopiedId === (message.id || String(idx)) ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                          <pre className="p-4 bg-[#0d0d0d] font-mono text-xs text-teal-100/90 overflow-x-auto selection:bg-primary/30">
                            <code>{message.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1 px-1">
                      <span className="text-[10px] text-muted-foreground/60 font-medium">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      {message.isSeen && isSentByMe && (
                        <span className="text-[10px] text-primary/60 font-bold uppercase tracking-tighter">Seen</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-primary/10 bg-panel/30">
        <form onSubmit={handleSend} className="space-y-4">
          {/* Preview Area */}
          {(previewUrl || selectedImage) && (
            <div className="relative inline-block">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-primary/30">
                <img 
                  src={selectedImage ? URL.createObjectURL(selectedImage) : previewUrl!} 
                  alt="Preview" 
                  className="h-full w-full object-cover" 
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 relative group">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={messageType === 'code' ? 'Insert code here...' : 'Type a message...'}
                className={`min-h-[50px] max-h-[200px] resize-none pr-12 bg-background/50 border-primary/10 focus:border-primary/30 transition-all duration-300 rounded-xl ${
                  messageType === 'code' ? 'font-mono text-xs ring-1 ring-primary/20' : ''
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <div className="absolute right-2 bottom-2 flex flex-col gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 rounded-lg transition-colors ${messageType === 'code' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                  onClick={() => setMessageType(messageType === 'code' ? 'text' : 'code')}
                >
                  <Code className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => setSelectedImage((e.target as HTMLInputElement).files?.[0] || null);
                    input.click();
                  }}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-xl bg-primary text-background hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20"
              disabled={isUploading || (!selectedImage && !newMessage.trim())}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Fullscreen Image Preview */}
      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <img src={previewUrl || ''} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl" />
        </DialogContent>
      </Dialog>
    </Card>
  );
}