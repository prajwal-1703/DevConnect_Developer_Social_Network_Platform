import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useMessaging } from '@/contexts/MessagingContext';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatBox } from '@/components/messages/ChatBox';

export default function Messages() {
  const { isConnected } = useMessaging();
  // Conversation selection is handled by context

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex">
        {/* Conversations List */}
        <div className="w-96 border-r border-border">
          <ConversationList />
        </div>

        {/* Chat Box */}
        <div className="flex-1">
          <ChatBox />
        </div>
      </div>
    </Layout>
  );
}

