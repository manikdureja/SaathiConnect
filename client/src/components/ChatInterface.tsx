import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  senderId: string;
  senderType: 'user' | 'doctor';
  message: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatRoomId: string;
  currentUserId: string;
  currentUserType: 'user' | 'doctor';
  otherPartyName: string;
  messages: Message[];
}

export default function ChatInterface({ 
  chatRoomId, 
  currentUserId, 
  currentUserType,
  otherPartyName,
  messages: initialMessages 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update messages when prop changes (persisted history loaded)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    // Connect to Socket.IO
    const socketInstance = io();
    setSocket(socketInstance);

    // Join the chat room
    socketInstance.emit("join-room", chatRoomId);

    // Listen for new messages
    socketInstance.on("receive-message", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [chatRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      chatRoomId,
      senderId: currentUserId,
      senderType: currentUserType,
      message: newMessage
    };

    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-screen">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {otherPartyName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{otherPartyName}</h3>
            <p className="text-sm text-muted-foreground">
              {currentUserType === 'user' ? 'Doctor' : 'Patient'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isOwnMessage = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${msg.id}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-lg">{msg.message}</p>
                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            data-testid="input-chat-message"
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-14 text-lg flex-1"
          />
          <Button
            data-testid="button-send-message"
            onClick={sendMessage}
            size="icon"
            className="min-h-14 w-14"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
