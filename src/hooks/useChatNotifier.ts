"use client";

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Custom hook to monitor chat messages and show toast notifications
 * for incoming messages from AI assistants or Staff.
 */
export const useChatNotifier = () => {
  const { messages, threads } = useChatStore();
  const router = useRouter();
  
  // Keep track of the message count to detect additions
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    // Check if new messages have been added to the store
    if (messages.length > prevMessagesLength.current) {
      const newMessages = messages.slice(prevMessagesLength.current);
      
      // Filter for messages not sent by the current user
      const incoming = newMessages.filter(m => m.sender !== 'user');

      if (incoming.length > 0) {
        const count = incoming.length;
        const lastMsg = incoming[count - 1];
        
        // Find the sender thread to get the name
        const senderThread = threads.find(t => t.id === lastMsg.threadId);
        const senderName = senderThread ? senderThread.name : "System";

        const label = count > 1 
          ? `Hey, ada ${count} pesan baru dari ${senderName}`
          : `Hey, ada 1 pesan baru dari ${senderName}`;

        // Show the interactive toast
        toast.info(label, {
          duration: 5000,
          action: {
            label: 'Baca',
            onClick: () => router.push('/chat'),
          },
          cancel: {
            label: 'Biarkan',
            onClick: () => console.log('Chat notification ignored'),
          },
        });
      }
    }
    
    // Update the ref to track the current state for the next check
    prevMessagesLength.current = messages.length;
  }, [messages, threads, router]);
};
