import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MessagingPage = () => {
  const { currentUser, messages, users, addMessage } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Get unique conversation partners
  const conversationPartners = Array.from(
    new Set(
      messages
        .filter(m => m.senderId === currentUser?.id || m.receiverId === currentUser?.id)
        .map(m => m.senderId === currentUser?.id ? m.receiverId : m.senderId)
    )
  ).map(id => users.find(u => u.id === id)).filter(Boolean);

  // Get messages for selected conversation
  const conversationMessages = selectedUserId
    ? messages.filter(
        m =>
          (m.senderId === currentUser?.id && m.receiverId === selectedUserId) ||
          (m.senderId === selectedUserId && m.receiverId === currentUser?.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !currentUser) return;

    const message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedUserId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    addMessage(message);
    setNewMessage('');
  };
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className='flex justify-between items-start'>
          <h1 className="text-3xl mb-8">Messages</h1>
          
          <div className='flex gap-1' onClick={() => navigate(-1)}>
            <ArrowLeft></ArrowLeft>
            <span>Back</span>
          </div>
        </div>

        <Card className="min-h-150 flex">
          {/* Conversations List */}
          <div className="w-80 border-r">
            <div className="p-4 border-b">
              <Input placeholder="Search conversations..." />
            </div>
            <div className="overflow-y-auto h-full">
              {conversationPartners.map(partner => {
                if (!partner) return null;
                const unread = messages.filter(
                  m => m.senderId === partner.id && m.receiverId === currentUser?.id && !m.read
                ).length;

                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedUserId(partner.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedUserId === partner.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {partner.avatar && (
                          <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="truncate">{partner.name}</h3>
                          {unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                              {unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {partner.skills?.[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {selectedUser.avatar && (
                        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3>{selectedUser.name}</h3>
                      <p className="text-sm text-gray-600">{selectedUser.skills?.[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map(msg => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-md px-4 py-2 rounded-lg ${
                            isMe ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Button type="button" variant="outline" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>

          {/* Sidebar */}
          {selectedUser && (
            <div className="w-80 border-l p-4">
              <h3 className="mb-4">Conversation Details</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm mb-2">Quick Actions</h4>
                  <Button variant="outline" className="w-full mb-2">View Profile</Button>
                  <Button variant="outline" className="w-full">Book Service</Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm mb-2">Contact Info</h4>
                  <p className="text-sm text-gray-600 mb-1">📧 {selectedUser.email}</p>
                  <p className="text-sm text-gray-600">📞 {selectedUser.phone}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
