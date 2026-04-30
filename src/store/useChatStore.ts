import { create } from 'zustand';

export type MessageSender = 'user' | 'ai' | 'staff';

export interface Message {
  id: string;
  threadId: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  isDeleted: boolean;
  status?: 'sending' | 'sent' | 'read' | 'failed';
}

export interface ChatThread {
  id: string;
  name: string;
  type: 'ai' | 'staff';
  avatar?: string;
  lastMessage?: string;
  unreadCount: number;
}

interface ChatState {
  threads: ChatThread[];
  messages: Message[];
  activeThreadId: string | null;
  totalUnreadCount: number;
  isTyping: Record<string, 'typing' | 'thinking' | null>;
  wsConnected: boolean;
  
  // Actions
  setActiveThread: (threadId: string | null) => void;
  sendMessage: (threadId: string, text: string, sender?: MessageSender) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  deleteMessage: (messageId: string) => void;
  clearHistory: (threadId: string) => void;
  markAsRead: (threadId: string) => void;
  setTypingIndicator: (threadId: string, status: 'typing' | 'thinking' | null) => void;
  connectWebSocket: (threadId: string) => void;
  disconnectWebSocket: () => void;
}

// Helper to calculate total unread
const calculateTotalUnread = (threads: ChatThread[]) => 
  threads.reduce((acc, t) => acc + t.unreadCount, 0);

// WebSocket connection
let ws: WebSocket | null = null;
const DEFAULT_BACKEND_API_URL = "https://ap1.aiuiso.site/api/v1";

const getWebSocketBaseUrl = () => {
  const configuredWsUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (configuredWsUrl) {
    return configuredWsUrl.replace(/\/+$/, "");
  }

  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl =
    configuredApiUrl && /^https?:\/\//i.test(configuredApiUrl)
      ? configuredApiUrl
      : DEFAULT_BACKEND_API_URL;

  const normalizedApiUrl = apiUrl.replace(/\/+$/, "");
  const apiBaseUrl = normalizedApiUrl.endsWith("/api/v1")
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api/v1`;

  return apiBaseUrl.replace(/^http/i, "ws");
};

// Helper to get token from storage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.state?.token || null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const useChatStore = create<ChatState>((set, get) => ({
  threads: [],
  messages: [],
  activeThreadId: null,
  totalUnreadCount: 0,
  isTyping: {},
  wsConnected: false,

  setActiveThread: (threadId) => {
    set({ activeThreadId: threadId });
    if (threadId) {
      const state = get();
      state.markAsRead(threadId);
      state.connectWebSocket(threadId);
    }
  },

  connectWebSocket: (threadId) => {
    const token = getToken();
    if (!token) {
      console.error('No auth token found for WebSocket connection');
      return;
    }

    // Close existing connection
    if (ws) {
      ws.close();
    }

    const wsBase = getWebSocketBaseUrl();
    const wsUrl = `${wsBase}/chat/stream?token=${encodeURIComponent(token)}&thread_id=${encodeURIComponent(threadId)}`;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      set({ wsConnected: true });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const state = get();

        if (data.type === 'typing_status') {
          state.setTypingIndicator(threadId, data.status);
        } else if (data.type === 'content') {
          const newMessage: Message = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            threadId,
            sender: threadId.includes('staff') ? 'staff' : 'ai',
            text: data.chunk,
            timestamp: Date.now(),
            isDeleted: false,
            status: 'sent',
          };
          set((state) => ({
            messages: [...state.messages, newMessage],
            threads: state.threads.map(t => 
              t.id === threadId 
                ? { ...t, lastMessage: data.chunk }
                : t
            ),
          }));
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      set({ wsConnected: false });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ wsConnected: false });
    };
  },

  disconnectWebSocket: () => {
    if (ws) {
      ws.close();
      ws = null;
    }
    set({ wsConnected: false });
  },

  sendMessage: (threadId, text, sender = 'user') => {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newMessage: Message = {
      id: messageId,
      threadId,
      sender,
      text,
      timestamp: Date.now(),
      isDeleted: false,
      status: 'sending',
    };

    set((state) => {
      const newThreads = state.threads.map((t) =>
        t.id === threadId 
          ? { ...t, lastMessage: text } 
          : t
      );
      
      return {
        messages: [...state.messages, newMessage],
        threads: newThreads,
        totalUnreadCount: calculateTotalUnread(newThreads),
      };
    });

    // Send via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(text);
      // Update status to sent
      setTimeout(() => {
        get().updateMessageStatus(messageId, 'sent');
      }, 500);
    } else {
      console.error('WebSocket not connected');
      get().updateMessageStatus(messageId, 'failed');
    }
  },

  updateMessageStatus: (messageId, status) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, status } : m
      ),
    }));
  },

  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, isDeleted: true } : m
      ),
    }));
  },

  clearHistory: (threadId) => {
    set((state) => {
      const newThreads = state.threads.map((t) =>
        t.id === threadId ? { ...t, lastMessage: undefined, unreadCount: 0 } : t
      );
      return {
        messages: state.messages.filter((m) => m.threadId !== threadId),
        threads: newThreads,
        totalUnreadCount: calculateTotalUnread(newThreads),
      };
    });
  },

  markAsRead: (threadId) => {
    set((state) => {
      const newThreads = state.threads.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t
      );
      return {
        threads: newThreads,
        totalUnreadCount: calculateTotalUnread(newThreads),
      };
    });
  },

  setTypingIndicator: (threadId, status) => {
    set((state) => ({
      isTyping: {
        ...state.isTyping,
        [threadId]: status,
      },
    }));
  },
}));
