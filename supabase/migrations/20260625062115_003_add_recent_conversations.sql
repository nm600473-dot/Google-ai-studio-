-- Add recent_conversations table
CREATE TABLE recent_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_summary TEXT NOT NULL,
  topic TEXT,
  message_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE recent_conversations ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX idx_recent_conversations_user_id ON recent_conversations(user_id);
CREATE INDEX idx_recent_conversations_timestamp ON recent_conversations(timestamp DESC);

-- Add additional columns to learning_profiles for quiz history and favorites
ALTER TABLE learning_profiles 
ADD COLUMN IF NOT EXISTS quiz_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS learning_streaks JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS favorite_subjects JSONB DEFAULT '[]';

-- Add columns to ai_memories for importance scoring
ALTER TABLE ai_memories
ADD COLUMN IF NOT EXISTS importance_score DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;