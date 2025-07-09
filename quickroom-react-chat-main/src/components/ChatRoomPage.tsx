
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Users, LogOut, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatContext } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';

const ChatRoomPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();
  const {
    roomCode,
    nickname,
    messages,
    users,
    isConnected,
    isTyping: usersTyping,
    sendMessage,
    connectToRoom,
    disconnectFromRoom
  } = useChatContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!roomCode || !nickname) {
      navigate('/');
      return;
    }

    connectToRoom();

    return () => {
      disconnectFromRoom();
    };
  }, [roomCode, nickname, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connection lost",
        description: "Trying to reconnect...",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connected",
        description: "You're now connected to the chat room",
      });
    }
  }, [isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      sendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleLeave = () => {
    disconnectFromRoom();
    navigate('/');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!roomCode || !nickname) {
    return null;
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-white">Room {roomCode}</h1>
              <p className="text-sm text-slate-400">Welcome, {nickname}</p>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">{users.length} users</span>
            </div>
            <Button
              onClick={handleLeave}
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === 'system_message' ? (
                  <div className="text-center">
                    <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                      {msg.message}
                    </span>
                  </div>
                ) : (
                  <div className={`flex ${msg.nickname === nickname ? 'justify-end' : 'justify-start'}`}>
                    <Card className={`max-w-xs lg:max-w-md p-3 ${
                      msg.nickname === nickname
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      {msg.nickname !== nickname && (
                        <div className="text-xs font-semibold mb-1 text-slate-300">
                          {msg.nickname}
                        </div>
                      )}
                      <div className="break-words">{msg.message}</div>
                      <div className={`text-xs mt-1 ${
                        msg.nickname === nickname ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            ))}
            
            {usersTyping.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm">
                  {usersTyping.join(', ')} {usersTyping.length === 1 ? 'is' : 'are'} typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleTyping}
                disabled={!isConnected}
                className="flex-1 bg-slate-900 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              <Button
                type="submit"
                disabled={!message.trim() || !isConnected}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Users Sidebar */}
        <div className="w-64 bg-slate-800 border-l border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Users ({users.length})
          </h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-2 rounded-lg ${
                  user.nickname === nickname
                    ? 'bg-blue-600/20 border border-blue-600/40'
                    : 'bg-slate-700/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">
                    {user.nickname}
                    {user.nickname === nickname && (
                      <span className="text-xs text-slate-400 ml-1">(you)</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
