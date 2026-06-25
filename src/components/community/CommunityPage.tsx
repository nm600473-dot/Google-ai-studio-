import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Send,
  Plus,
  Search,
  Bell,
  Hash,
  Lock,
  Globe,
  UsersRound,
  ChevronRight,
  Smile,
  Paperclip,
  Mic,
  MoreVertical,
  Check,
  Clock,
  UserPlus,
  Settings,
} from 'lucide-react';
import { GlassCard, Button, Input, Badge, Avatar } from '../ui/GlassCard';
import { useAuth } from '../../contexts/AuthContext';

interface Group {
  id: string;
  name: string;
  subject: string;
  members: number;
  isPublic: boolean;
  lastMessage?: string;
  lastActivity?: string;
  avatar?: string;
  unread?: number;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'voice';
  reactions?: { emoji: string; count: number }[];
}

const sampleGroups: Group[] = [
  { id: '1', name: 'Math Study Group', subject: 'Mathematics', members: 45, isPublic: true, lastMessage: 'Anyone solved problem 15?', lastActivity: '2 min ago', unread: 3 },
  { id: '2', name: 'Physics Enthusiasts', subject: 'Physics', members: 32, isPublic: true, lastMessage: 'The formula is F=ma', lastActivity: '15 min ago', unread: 0 },
  { id: '3', name: 'Chemistry Lab', subject: 'Chemistry', members: 28, isPublic: false, lastMessage: 'Check out this reaction!', lastActivity: '1 hour ago', unread: 0 },
  { id: '4', name: 'Biology Class 10A', subject: 'Biology', members: 24, isPublic: true, lastMessage: 'Exam prep tomorrow?', lastActivity: '3 hours ago', unread: 1 },
  { id: '5', name: 'English Literature', subject: 'English', members: 18, isPublic: true, lastMessage: 'Great analysis!', lastActivity: 'Yesterday', unread: 0 },
];

const sampleMessages: Message[] = [
  { id: '1', userId: '2', userName: 'Sarah K.', content: 'Hey everyone! Has anyone started on chapter 5 problems?', timestamp: new Date(Date.now() - 3600000 * 2), type: 'text' },
  { id: '2', userId: '3', userName: 'Mike T.', content: 'I just finished them! The key is to remember the quadratic formula.', timestamp: new Date(Date.now() - 3600000 * 1.5), type: 'text' },
  { id: '3', userId: '4', userName: 'Emma L.', content: 'Can someone explain problem 12? I keep getting a different answer.', timestamp: new Date(Date.now() - 3600000), type: 'text' },
  { id: '4', userId: '2', userName: 'Sarah K.', content: 'Sure! Let me share my solution...', timestamp: new Date(Date.now() - 1800000), type: 'text' },
  { id: '5', userId: '5', userName: 'Alex J.', content: 'Thanks for the help everyone! This group is awesome.', timestamp: new Date(Date.now() - 900000), type: 'text' },
];

export function CommunityPage() {
  const { profile } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(sampleGroups[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredGroups = sampleGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: profile?.id || 'current',
      userName: profile?.full_name?.split(' ')[0] || 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const onlineMembers = [
    { id: '1', name: 'Sarah K.', avatar: null, status: 'studying' },
    { id: '2', name: 'Mike T.', avatar: null, status: 'online' },
    { id: '3', name: 'Emma L.', avatar: null, status: 'quiz' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4">
      <div className="w-72 flex-shrink-0 hidden lg:block">
        <GlassCard className="h-full flex flex-col" padding="sm">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Study Groups</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="w-4 h-4" />}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredGroups.map((group, index) => (
              <motion.button
                key={group.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-3 rounded-xl text-left transition-all relative ${
                  selectedGroup?.id === group.id
                    ? 'bg-primary/20 border border-primary/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white truncate">{group.name}</span>
                      {group.isPublic ? (
                        <Globe className="w-3 h-3 text-gray-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{group.lastMessage || 'No messages yet'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{group.lastActivity}</span>
                      <span className="text-xs text-gray-500">- {group.members} members</span>
                    </div>
                  </div>
                </div>
                {group.unread && group.unread > 0 && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {group.unread}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              className="w-full"
            >
              Join New Group
            </Button>
          </div>
        </GlassCard>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedGroup ? (
          <>
            <GlassCard className="flex-shrink-0" padding="sm">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{selectedGroup.name}</h3>
                      <Badge variant="primary" size="sm">{selectedGroup.subject}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">{selectedGroup.members} members - {selectedGroup.isPublic ? 'Public' : 'Private'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Bell className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<Users className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<Settings className="w-4 h-4" />} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex-1 flex flex-col overflow-hidden mt-4" padding="sm">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${
                        message.userId === profile?.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar fallback={message.userName} size="sm" />
                      <div className={`flex flex-col ${message.userId === profile?.id ? 'items-end' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-300">{message.userName}</span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl text-white ${
                            message.userId === profile?.id
                              ? 'message-bubble message-bubble-sent'
                              : 'message-bubble message-bubble-received'
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {message.reactions.map((reaction, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full bg-white/10 text-sm"
                              >
                                {reaction.emoji} {reaction.count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Plus className="w-5 h-5" />} />
                  <Button variant="ghost" size="sm" icon={<Paperclip className="w-5 h-5" />} />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Smile className="w-5 h-5" />}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSendMessage}
                    icon={<Send className="w-5 h-5" />}
                  />
                </div>
              </div>
            </GlassCard>
          </>
        ) : (
          <GlassCard className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a group</h3>
              <p className="text-gray-400">Choose a study group to start chatting</p>
            </div>
          </GlassCard>
        )}
      </div>

      <div className="w-64 flex-shrink-0 hidden xl:block">
        <GlassCard className="h-full" padding="sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <UsersRound className="w-4 h-4 text-primary" />
              Online Now
            </h3>
          </div>

          <div className="p-3 space-y-2">
            {onlineMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <Avatar fallback={member.name} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.status}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="space-y-2">
              {[
                { icon: Users, label: 'All Members', value: selectedGroup?.members || 0 },
                { icon: Clock, label: 'Active Today', value: 12 },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <stat.icon className="w-4 h-4" />
                    {stat.label}
                  </span>
                  <span className="text-white font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="lg:hidden fixed bottom-20 left-4 right-4 glass rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {filteredGroups.slice(0, 3).map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`flex-shrink-0 p-2 rounded-lg ${
                selectedGroup?.id === group.id ? 'bg-primary/20' : 'bg-white/5'
              }`}
            >
              <Hash className="w-5 h-5 text-white" />
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<ChevronRight className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}
