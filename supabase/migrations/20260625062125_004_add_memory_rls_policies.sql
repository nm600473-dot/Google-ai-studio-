-- RLS policies for recent_conversations
CREATE POLICY "select_own_conversations" ON recent_conversations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_conversations" ON recent_conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_conversations" ON recent_conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_conversations" ON recent_conversations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS policies for ai_memories (these should already exist from 002 but let's ensure they're there)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_memories' AND policyname = 'select_own_memories') THEN
    CREATE POLICY "select_own_memories" ON ai_memories FOR SELECT
      TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_memories' AND policyname = 'insert_own_memories') THEN
    CREATE POLICY "insert_own_memories" ON ai_memories FOR INSERT
      TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_memories' AND policyname = 'update_own_memories') THEN
    CREATE POLICY "update_own_memories" ON ai_memories FOR UPDATE
      TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_memories' AND policyname = 'delete_own_memories') THEN
    CREATE POLICY "delete_own_memories" ON ai_memories FOR DELETE
      TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS policies for learning_profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'learning_profiles' AND policyname = 'select_own_learning_profile') THEN
    CREATE POLICY "select_own_learning_profile" ON learning_profiles FOR SELECT
      TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'learning_profiles' AND policyname = 'insert_own_learning_profile') THEN
    CREATE POLICY "insert_own_learning_profile" ON learning_profiles FOR INSERT
      TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'learning_profiles' AND policyname = 'update_own_learning_profile') THEN
    CREATE POLICY "update_own_learning_profile" ON learning_profiles FOR UPDATE
      TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;