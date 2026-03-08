import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, ArrowLeft, Search } from 'lucide-react';
import { messagesAPI, connectSocket, disconnectSocket, getSocket } from '@/services/api';
import { useApp } from '@/context/AppContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationUser {
  _id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  role?: string;
}

interface Conversation {
  _id: ConversationUser;
  lastMessage: Message;
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  timestamp: string;
  createdAt?: string;
}

interface MessagingPageProps {
  currentUser: { _id: string; name: string; avatar?: string } | null;
}

export const MessagingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useApp();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [activeConv, setActiveConv]       = useState<Conversation | null>(null);
  const [newMessage, setNewMessage]       = useState('');
  const [searchQuery, setSearchQuery]     = useState('');
  const [loadingConvs, setLoadingConvs]   = useState(false);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [typingUsers, setTypingUsers]     = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers]     = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeConvRef  = useRef<Conversation | null>(null);

  // Keep ref in sync so socket handlers avoid stale closures
  useEffect(() => { activeConvRef.current = activeConv; }, [activeConv]);

  // ─── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Socket connection ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser?._id) return;

    connectSocket(currentUser._id);
    const socket = getSocket();
    if (!socket) return;

    socket.on('new_message', (msg: Message) => {
      const otherId = activeConvRef.current?._id._id;
      if (msg.sender === otherId || msg.receiver === otherId) {
        setMessages((prev) => appendIfNew(prev, msg));
      }
      setConversations((prev) => updateConvList(prev, msg, currentUser._id));
    });

    socket.on('message_sent', (msg: Message) => {
      setMessages((prev) => appendIfNew(prev, msg));
      setConversations((prev) => updateConvList(prev, msg, currentUser._id));
    });

    socket.on('user_typing', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => new Set([...prev, userId]));
    });

    socket.on('user_stop_typing', ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => { const s = new Set(prev); s.delete(userId); return s; });
    });

    socket.on('user_online', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on('user_offline', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => { const s = new Set(prev); s.delete(userId); return s; });
    });

    return () => {
      socket.off('new_message');
      socket.off('message_sent');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('user_online');
      socket.off('user_offline');
      disconnectSocket();
    };
  }, [currentUser?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Open a conversation ─────────────────────────────────────────────────────
  // Defined before the auto-open effect so it can be referenced safely
  const openConversation = useCallback(async (conv: Conversation) => {
    setActiveConv(conv);
    setLoadingMsgs(true);
    try {
      const res = await messagesAPI.getMessages(conv._id._id);
      setMessages(res.data.messages ?? []);
      setConversations((prev) =>
        prev.map((c) => c._id._id === conv._id._id ? { ...c, unreadCount: 0 } : c)
      );
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // ─── Fetch conversations on mount ────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const res = await messagesAPI.getConversations();
      setConversations(res.data.conversations ?? []);
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ─── Auto-open from ?userId=&name=&avatar= query params ──────────────────────
  // ArtisanProfilePage navigates to /messages?userId=X&name=Y&avatar=Z when
  // the "Message" button is clicked. This effect fires after conversations load
  // and opens the correct chat automatically — no extra click needed.
  //
  // • If the artisan already exists in the conversations list we use that full
  //   object (has email, phone, etc.).
  // • Otherwise we build a minimal object from the query params so the chat
  //   opens immediately even on first contact.
  useEffect(() => {
    const userId = searchParams.get('userId');
    const name   = searchParams.get('name');

    if (!userId || !name || activeConv) return; // nothing to do

    const existingConv = conversations.find((c) => c._id._id === userId);

    const convToOpen: Conversation = existingConv ?? {
      _id: {
        _id:    userId,
        name,
        avatar: searchParams.get('avatar') ?? undefined,
        skills: [],
      },
      lastMessage: {} as Message,
      unreadCount: 0,
    };

    openConversation(convToOpen);

    // Remove query params so a page refresh doesn't re-trigger this
    navigate('/messages', { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  // ─── Send message ────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!newMessage.trim() || !activeConv || !currentUser) return;

    const receiverId = activeConv._id._id;
    const content    = newMessage.trim();
    setNewMessage('');
    stopTyping();

    const socket = getSocket();
    if (socket) {
      socket.emit('send_message', { receiverId, content });
    } else {
      // Fallback to REST API if socket disconnected
      try {
        const res = await messagesAPI.sendMessage(receiverId, content);
        setMessages((prev) => appendIfNew(prev, res.data.message));
        setConversations((prev) => updateConvList(prev, res.data.message, currentUser._id));
      } catch (err) {
        console.error('Failed to send message', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      startTyping();
    }
  };

  // ─── Typing indicators ───────────────────────────────────────────────────────
  const startTyping = () => {
    if (!activeConv) return;
    const socket = getSocket();
    socket?.emit('typing', { receiverId: activeConv._id._id });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 3000);
  };

  const stopTyping = () => {
    if (!activeConv) return;
    const socket = getSocket();
    socket?.emit('stop_typing', { receiverId: activeConv._id._id });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  // ─── Derived values ──────────────────────────────────────────────────────────
  const filteredConversations = conversations.filter((c) =>
    c._id.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = activeConv?._id ?? null;
  const isTyping     = !!(selectedUser && typingUsers.has(selectedUser._id));
  const isOnline     = !!(selectedUser && onlineUsers.has(selectedUser._id));

  
  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Messages</h1>
          <div
            className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </div>
        </div>

        <Card className="flex overflow-hidden" style={{ minHeight: '75vh' }}>

          {/* ── Conversations sidebar ─────────────────────────────────────── */}
          <div className="w-80 border-r flex flex-col shrink-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {loadingConvs ? (
                <p className="text-center text-gray-400 p-6 text-sm">Loading…</p>
              ) : filteredConversations.length === 0 ? (
                <p className="text-center text-gray-400 p-6 text-sm">No conversations yet.</p>
              ) : (
                filteredConversations.map((conv) => {
                  const partner  = conv._id;
                  const isActive = activeConv?._id._id === partner._id;
                  const online   = onlineUsers.has(partner._id);

                  return (
                    <div
                      key={partner._id}
                      onClick={() => openConversation(conv)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        isActive ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden">
                            {partner.avatar ? (
                              <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-sm">
                                {partner.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          {online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold truncate">{partner.name}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1 shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {conv.lastMessage?.content ?? partner.skills?.[0] ?? ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Chat area ────────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0">
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start messaging
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-4 border-b bg-white flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-sm">
                          {selectedUser.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{selectedUser.name}</h3>
                    <p className="text-xs text-gray-500">
                      {isTyping ? (
                        <span className="text-blue-500 italic">typing…</span>
                      ) : isOnline ? (
                        <span className="text-green-500">Online</span>
                      ) : (
                        selectedUser.skills?.[0] ?? 'Offline'
                      )}
                    </p>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <p className="text-center text-gray-400 text-sm">Loading messages…</p>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm">No messages yet. Say hello!</p>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === currentUser?._id;
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-sm px-4 py-2 rounded-2xl text-sm ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                              {new Date(msg.timestamp ?? msg.createdAt ?? '').toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input bar */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2 items-center">
                    <Button type="button" variant="outline" size="icon" className="shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="shrink-0"
                      disabled={!newMessage.trim()}
                      onClick={handleSend}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────────── */}
          {selectedUser && (
            <div className="w-72 border-l p-4 shrink-0 hidden lg:block">
              <h3 className="font-semibold mb-4">Conversation Details</h3>

              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-2">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm">{selectedUser.name}</p>
                {selectedUser.skills?.[0] && (
                  <p className="text-xs text-gray-500 mt-0.5">{selectedUser.skills[0]}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Actions</h4>
                  <Button
                    variant="outline"
                    className="w-full mb-2 text-sm"
                    onClick={() => navigate(`/artisans/${selectedUser._id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                    onClick={() => navigate(`/book/${selectedUser._id}`)}
                  >
                    Book Service
                  </Button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact Info</h4>
                  {selectedUser.email && (
                    <p className="text-sm text-gray-600 mb-1">📧 {selectedUser.email}</p>
                  )}
                  {selectedUser.phone && (
                    <p className="text-sm text-gray-600">📞 {selectedUser.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function appendIfNew(prev: Message[], msg: Message): Message[] {
  return prev.some((m) => m._id === msg._id) ? prev : [...prev, msg];
}

function updateConvList(
  convs: Conversation[],
  msg: Message,
  currentUserId: string
): Conversation[] {
  const otherId = msg.sender === currentUserId ? msg.receiver : msg.sender;
  const exists  = convs.find((c) => c._id._id === otherId);

  if (exists) {
    return convs.map((c) =>
      c._id._id === otherId
        ? {
            ...c,
            lastMessage: msg,
            unreadCount: msg.sender !== currentUserId ? c.unreadCount + 1 : c.unreadCount
          }
        : c
    );
  }

  return [
    {
      _id: { _id: otherId, name: '', skills: [] },
      lastMessage: msg,
      unreadCount: msg.sender !== currentUserId ? 1 : 0
    } as Conversation,
    ...convs
  ];
}
