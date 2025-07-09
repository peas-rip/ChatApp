
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChatContext } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';

const JoinRoomPage: React.FC = () => {
  const [roomCode, setRoomCodeInput] = useState('');
  const [nickname, setNicknameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setRoomCode, setNickname } = useChatContext();
  const { toast } = useToast();

  const joinRoom = async () => {
    if (!roomCode.trim() || !nickname.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both room code and nickname.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/join-room/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_code: roomCode.trim().toUpperCase(),
          nickname: nickname.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRoomCode(roomCode.trim().toUpperCase());
          setNickname(nickname.trim());
          toast({
            title: "Joined room!",
            description: `Welcome to room ${roomCode.trim().toUpperCase()}`,
          });
          navigate('/chat');
        } else {
          throw new Error('Room not found or invalid');
        }
      } else {
        throw new Error('Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room. Please check the room code and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCodeInput(e.target.value.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-white">Join Room</CardTitle>
          <CardDescription className="text-slate-300">
            Enter the room code and your nickname to join
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roomCode" className="text-slate-300">Room Code</Label>
            <Input
              id="roomCode"
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={handleRoomCodeChange}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 font-mono text-center text-lg tracking-wider"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-slate-300">Your Nickname</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNicknameInput(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <Button
              onClick={joinRoom}
              disabled={isLoading || !roomCode.trim() || !nickname.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white py-6 text-lg"
            >
              {isLoading ? 'Joining Room...' : 'Join Room'}
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

export default JoinRoomPage;
