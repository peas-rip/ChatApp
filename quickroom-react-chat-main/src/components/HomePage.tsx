
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-16 w-16 text-purple-400 mr-4" />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Quick<span className="text-purple-400">Room</span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join anonymous chat rooms instantly. No registration required. 
            Connect, chat, and collaborate in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
                <Plus className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Create Room</CardTitle>
              <CardDescription className="text-slate-300">
                Start a new chat room and invite others to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                <Link to="/create">
                  Create New Room
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-white">Join Room</CardTitle>
              <CardDescription className="text-slate-300">
                Enter a room code to join an existing conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                <Link to="/join">
                  Join Existing Room
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 text-slate-400">
            <div className="flex flex-col items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mb-3">
                <MessageCircle className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Real-time Chat</h3>
              <p className="text-sm">Instant messaging with live updates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Anonymous</h3>
              <p className="text-sm">No registration or personal info required</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-500/20 p-3 rounded-full mb-3">
                <Plus className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Easy Setup</h3>
              <p className="text-sm">Create or join rooms in seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
