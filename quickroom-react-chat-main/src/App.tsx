
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import HomePage from "./components/HomePage";
import CreateRoomPage from "./components/CreateRoomPage";
import JoinRoomPage from "./components/JoinRoomPage";
import ChatRoomPage from "./components/ChatRoomPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateRoomPage />} />
            <Route path="/join" element={<JoinRoomPage />} />
            <Route path="/chat" element={<ChatRoomPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
