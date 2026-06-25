-- RLS Policies for profiles
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS Policies for subjects (public read)
CREATE POLICY "select_subjects_public" ON subjects FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "insert_subjects_admin" ON subjects FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for books
CREATE POLICY "select_books_public" ON books FOR SELECT
  TO authenticated USING (is_public = true OR uploaded_by = auth.uid());
CREATE POLICY "insert_books_teacher" ON books FOR INSERT
  TO authenticated WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "update_own_books" ON books FOR UPDATE
  TO authenticated USING (uploaded_by = auth.uid()) WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "delete_own_books" ON books FOR DELETE
  TO authenticated USING (uploaded_by = auth.uid());

-- RLS Policies for bookmarks
CREATE POLICY "select_own_bookmarks" ON bookmarks FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_bookmarks" ON bookmarks FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_bookmarks" ON bookmarks FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_bookmarks" ON bookmarks FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for ai_memories
CREATE POLICY "select_own_memories" ON ai_memories FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_memories" ON ai_memories FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_memories" ON ai_memories FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_memories" ON ai_memories FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for learning_profiles
CREATE POLICY "select_own_learning" ON learning_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_learning" ON learning_profiles FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_learning" ON learning_profiles FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for quizzes
CREATE POLICY "select_quizzes_public" ON quizzes FOR SELECT
  TO authenticated USING (is_public = true OR created_by = auth.uid());
CREATE POLICY "insert_own_quizzes" ON quizzes FOR INSERT
  TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "update_own_quizzes" ON quizzes FOR UPDATE
  TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "delete_own_quizzes" ON quizzes FOR DELETE
  TO authenticated USING (created_by = auth.uid());

-- RLS Policies for questions
CREATE POLICY "select_questions_own" ON questions FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = questions.quiz_id AND (quizzes.is_public = true OR quizzes.created_by = auth.uid())));
CREATE POLICY "insert_own_questions" ON questions FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = questions.quiz_id AND quizzes.created_by = auth.uid()));
CREATE POLICY "update_own_questions" ON questions FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = questions.quiz_id AND quizzes.created_by = auth.uid()));
CREATE POLICY "delete_own_questions" ON questions FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = questions.quiz_id AND quizzes.created_by = auth.uid()));

-- RLS Policies for quiz_attempts
CREATE POLICY "select_own_attempts" ON quiz_attempts FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_attempts" ON quiz_attempts FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_attempts" ON quiz_attempts FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for flashcards
CREATE POLICY "select_own_flashcards" ON flashcards FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_flashcards" ON flashcards FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_flashcards" ON flashcards FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_flashcards" ON flashcards FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for study_plans
CREATE POLICY "select_own_plans" ON study_plans FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_plans" ON study_plans FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_plans" ON study_plans FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_plans" ON study_plans FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for study_sessions
CREATE POLICY "select_own_sessions" ON study_sessions FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_sessions" ON study_sessions FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_sessions" ON study_sessions FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for achievements (public read)
CREATE POLICY "select_achievements_public" ON achievements FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "select_own_achievements" ON user_achievements FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_achievements" ON user_achievements FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for badges (public read)
CREATE POLICY "select_badges_public" ON badges FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for user_badges
CREATE POLICY "select_own_badges" ON user_badges FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_badges" ON user_badges FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for study_groups
CREATE POLICY "select groups_member" ON study_groups FOR SELECT
  TO authenticated USING (is_public = true OR EXISTS (SELECT 1 FROM group_members WHERE group_id = study_groups.id AND user_id = auth.uid()));
CREATE POLICY "insert_own_groups" ON study_groups FOR INSERT
  TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "update_own_groups" ON study_groups FOR UPDATE
  TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "delete_own_groups" ON study_groups FOR DELETE
  TO authenticated USING (created_by = auth.uid());

-- RLS Policies for group_members
CREATE POLICY "select_group_members" ON group_members FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()));
CREATE POLICY "insert_group_members" ON group_members FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM study_groups WHERE study_groups.id = group_id AND (created_by = auth.uid() OR is_public = true)));
CREATE POLICY "delete_group_members" ON group_members FOR DELETE
  TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM study_groups WHERE study_groups.id = group_members.group_id AND created_by = auth.uid()));

-- RLS Policies for messages
CREATE POLICY "select_group_messages" ON messages FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM group_members WHERE group_id = messages.group_id AND user_id = auth.uid()));
CREATE POLICY "insert_group_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM group_members WHERE group_id = messages.group_id AND user_id = auth.uid()));
CREATE POLICY "update_own_messages" ON messages FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for message_reactions
CREATE POLICY "select_message_reactions" ON message_reactions FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM group_members WHERE group_id = (SELECT group_id FROM messages WHERE messages.id = message_reactions.message_id) AND user_id = auth.uid()));
CREATE POLICY "insert_own_reactions" ON message_reactions FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_reactions" ON message_reactions FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for battles
CREATE POLICY "select_own_battles" ON battles FOR SELECT
  TO authenticated USING (challenger_id = auth.uid() OR opponent_id = auth.uid());
CREATE POLICY "insert_own_battles" ON battles FOR INSERT
  TO authenticated WITH CHECK (challenger_id = auth.uid());
CREATE POLICY "update_own_battles" ON battles FOR UPDATE
  TO authenticated USING (challenger_id = auth.uid() OR opponent_id = auth.uid()) WITH CHECK (challenger_id = auth.uid() OR opponent_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for student_analytics
CREATE POLICY "select_own_analytics" ON student_analytics FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_analytics" ON student_analytics FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_analytics" ON student_analytics FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for exam_results
CREATE POLICY "select_own_exams" ON exam_results FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_exams" ON exam_results FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for ai_companions
CREATE POLICY "select_own_companion" ON ai_companions FOR SELECT
  TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_companion" ON ai_companions FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_companion" ON ai_companions FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());