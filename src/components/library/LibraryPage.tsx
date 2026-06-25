import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  Download,
  Share2,
  Clock,
  Star,
  ChevronRight,
  Play,
  Eye,
  Brain,
  FileText,
  Video,
  Headphones,
} from 'lucide-react';
import { GlassCard, Button, Input, Badge, Tabs } from '../ui/GlassCard';

interface LibraryItem {
  id: string;
  title: string;
  type: 'book' | 'video' | 'audio' | 'document';
  subject: string;
  author: string;
  coverImage?: string;
  progress?: number;
  rating: number;
  duration: string;
  description: string;
}

const libraryItems: LibraryItem[] = [
  { id: '1', title: 'Grade 10 Mathematics', type: 'book', subject: 'Mathematics', author: 'Ministry of Education', progress: 75, rating: 4.8, duration: '320 pages', description: 'Complete curriculum for Grade 10 mathematics covering algebra, geometry, and calculus fundamentals.' },
  { id: '2', title: 'Biology: Life Sciences', type: 'book', subject: 'Biology', author: 'Dr. Sarah Chen', progress: 45, rating: 4.9, duration: '280 pages', description: 'Explore the fascinating world of living organisms, from cellular biology to ecosystems.' },
  { id: '3', title: 'Chemistry Experiments', type: 'video', subject: 'Chemistry', author: 'Dr. Lab', progress: 30, rating: 4.7, duration: '2h 45m', description: 'Visual demonstrations of key chemistry concepts through exciting experiments.' },
  { id: '4', title: 'Physics Fundamentals', type: 'book', subject: 'Physics', author: 'Prof. Newton', progress: 60, rating: 4.6, duration: '250 pages', description: 'Master the fundamental principles of physics including mechanics, thermodynamics, and waves.' },
  { id: '5', title: 'English Literature Guide', type: 'document', subject: 'English', author: 'Literature Dept.', progress: 20, rating: 4.5, duration: '150 pages', description: 'Analysis of classic literature works commonly studied in Grade 10.' },
  { id: '6', title: 'History Audiobook', type: 'audio', subject: 'History', author: 'AudioLearn', progress: 55, rating: 4.4, duration: '5h 30m', description: 'Comprehensive audio guide covering major historical events and their impact.' },
  { id: '7', title: 'ICT Practical Guide', type: 'document', subject: 'ICT', author: 'Tech Academy', progress: 0, rating: 4.8, duration: '100 pages', description: 'Hands-on guide to information and communication technology concepts.' },
  { id: '8', title: 'Geography: World Tour', type: 'video', subject: 'Geography', author: 'GeoWorld', progress: 10, rating: 4.6, duration: '4h', description: 'Virtual tour of geographical features and climates around the world.' },
];

const subjectFilters = [
  { id: 'all', label: 'All Subjects' },
  { id: 'Mathematics', label: 'Mathematics' },
  { id: 'Biology', label: 'Biology' },
  { id: 'Chemistry', label: 'Chemistry' },
  { id: 'Physics', label: 'Physics' },
  { id: 'English', label: 'English' },
  { id: 'History', label: 'History' },
  { id: 'Geography', label: 'Geography' },
  { id: 'ICT', label: 'ICT' },
];

const typeFilters = [
  { id: 'all', label: 'All', icon: null },
  { id: 'book', label: 'Books', icon: BookOpen },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'audio', label: 'Audio', icon: Headphones },
  { id: 'document', label: 'Docs', icon: FileText },
];

export function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'video': return Play;
      case 'audio': return Headphones;
      case 'document': return FileText;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return '#4F8CFF';
      case 'video': return '#FF6B6B';
      case 'audio': return '#7C4DFF';
      case 'document': return '#00D084';
      default: return '#4F8CFF';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, videos, audio..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {typeFilters.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedType === type.id
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {type.icon && <type.icon className="w-4 h-4" />}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {subjectFilters.map(subject => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedSubject === subject.id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {selectedItem ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Library
          </button>

          <GlassCard>
            <div className="flex flex-col md:flex-row gap-6">
              <div
                className="w-full md:w-48 h-64 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${getTypeColor(selectedItem.type)}20` }}
              >
                {React.createElement(getTypeIcon(selectedItem.type), {
                  className: 'w-16 h-16',
                  style: { color: getTypeColor(selectedItem.type) }
                })}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={selectedItem.type === 'book' ? 'primary' : selectedItem.type === 'video' ? 'danger' : selectedItem.type === 'audio' ? 'secondary' : 'success'}
                  >
                    {selectedItem.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Bookmark className="w-4 h-4" />}
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <p className="text-gray-400 mb-2">by {selectedItem.author}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning" />
                    {selectedItem.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedItem.duration}
                  </span>
                  <Badge variant="primary">{selectedItem.subject}</Badge>
                </div>

                <p className="text-gray-300 mb-6">{selectedItem.description}</p>

                {selectedItem.progress !== undefined && selectedItem.progress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{selectedItem.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedItem.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    icon={selectedItem.type === 'video' ? <Play className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  >
                    {selectedItem.progress ? 'Continue' : 'Start Reading'}
                  </Button>
                  <Button
                    variant="outline"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              AI Learning Tools
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Summarize Content', icon: FileText },
                { label: 'Generate Quiz from Book', icon: Brain },
                { label: 'Create Flashcards', icon: Bookmark },
                { label: 'Explain Key Concepts', icon: Eye },
              ].map((tool, i) => (
                <Button key={i} variant="ghost" icon={<tool.icon className="w-4 h-4" />} className="justify-start">
                  {tool.label}
                </Button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard
                  hover
                  onClick={() => setSelectedItem(item)}
                  className="group"
                >
                  <div
                    className="aspect-[4/3] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: `${getTypeColor(item.type)}20` }}
                  >
                    {React.createElement(getTypeIcon(item.type), {
                      className: 'w-12 h-12',
                      style: { color: getTypeColor(item.type) }
                    })}

                    {item.progress !== undefined && item.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <Badge
                    variant={item.type === 'book' ? 'primary' : item.type === 'video' ? 'danger' : item.type === 'audio' ? 'secondary' : 'success'}
                    size="sm"
                    className="mb-2"
                  >
                    {item.type}
                  </Badge>

                  <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{item.author}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning" />
                      {item.rating}
                    </span>
                    <span>{item.duration}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
