import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  nickname: string;
}

interface Message {
  id: string;
  type: 'chat_message' | 'system_message' | 'user_joined' | 'user_left';
  nickname?: string;
  message: string;
  timestamp: Date;
}

interface ChatContextType {
  roomCode: string | null;
  nickname: string | null;
  users: User[];
  messages: Message[];
  isConnected: boolean;
  isTyping: string[];
  setRoomCode: (code: string) => void;
  setNickname: (name: string) => void;
  sendMessage: (message: string) => void;
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectToRoom = () => {
    if (!roomCode || !nickname || (ws && ws.readyState === WebSocket.OPEN)) return;

    const websocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomCode}/`);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setWs(websocket);

      // ✅ Send join message with nickname and room_code
      websocket.send(JSON.stringify({
        type: 'join',
        nickname: nickname,
        room_code: roomCode
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'chat_message') {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'chat_message',
          nickname: data.nickname,
          message: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (data.type === 'system_message') {
        const systemMessage: Message = {
          id: Date.now().toString(),
          type: 'system_message',
          message: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
      } else if (data.type === 'user_list') {
        setUsers(data.users || []);
      } else if (data.type === 'typing_indicator') {
        if (data.is_typing) {
          setIsTyping(prev => [...prev.filter(user => user !== data.nickname), data.nickname]);
        } else {
          setIsTyping(prev => prev.filter(user => user !== data.nickname));
        }
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const disconnectFromRoom = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
    setIsConnected(false);
    setMessages([]);
    setUsers([]);
    setIsTyping([]);
  };

  const sendMessage = (message: string) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        message: message
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const value: ChatContextType = {
    roomCode,
    nickname,
    users,
    messages,
    isConnected,
    isTyping,
    setRoomCode,
    setNickname,
    sendMessage,
    connectToRoom,
    disconnectFromRoom
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
