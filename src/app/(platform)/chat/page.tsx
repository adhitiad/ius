"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";

export default function ChatPage() {
  const { activeThreadId, fetchThreads } = useChatStore();

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Container untuk Panel Kiri (Daftar Kontak) */}
      <div
        className={cn(
          "w-full md:w-1/3 border-r border-border shrink-0 transition-all duration-300",
          activeThreadId ? "hidden md:block" : "block",
        )}
      >
        <ChatList />
      </div>

      {/* Container untuk Panel Kanan (Ruang Obrolan) */}
      <div
        className={cn(
          "flex-1 h-full transition-all duration-300",
          !activeThreadId ? "hidden md:flex" : "flex flex-col",
        )}
      >
        <ChatRoom />
      </div>
    </div>
  );
}
