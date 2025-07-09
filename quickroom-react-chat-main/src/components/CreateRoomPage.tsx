
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Copy, Check, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChatContext } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';

const CreateRoomPage: React.FC = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [nickname, setNicknameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { setRoomCode: setContextRoomCode, setNickname } = useChatContext();
  const { toast } = useToast();

  const createRoom = async () => {
    if (!nickname.trim()) {
      toast({
        title: "Nickname required",
        description: "Please enter a nickname to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/create-room/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoomCode(data.room_code);
        setContextRoomCode(data.room_code);
        setNickname(nickname.trim());
        setIsCreated(true);
        toast({
          title: "Room created!",
          description: `Room code: ${data.room_code}`,
        });
      } else {
        throw new Error('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const joinChat = () => {
    navigate('/chat');
  };

  if (isCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-white">Room Created!</CardTitle>
            <CardDescription className="text-slate-300">
              Share this code with others to invite them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Label className="text-slate-300 text-sm">Room Code</Label>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                  <span className="text-2xl font-mono font-bold text-white tracking-wider">
                    {roomCode}
                  </span>
                </div>
                <Button
                  onClick={copyRoomCode}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 bg-slate-700 hover:bg-slate-600"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-300" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={joinChat}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                Enter Chat Room
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
            <MessageCircle className="h-8 w-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-white">Create New Room</CardTitle>
          <CardDescription className="text-slate-300">
            Choose a nickname and create your chat room
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-slate-300">Your Nickname</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNicknameInput(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400"
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <Button
              onClick={createRoom}
              disabled={isLoading || !nickname.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white py-6 text-lg"
            >
              {isLoading ? 'Creating Room...' : 'Create Room'}
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-300"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoomPage;
