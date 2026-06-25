# EduVerse - AI-Powered Learning Platform

A comprehensive educational platform with AI tutoring, flashcards, quizzes, study plans, and personalized learning experiences.

## Features

- **AI Tutor** - Personalized AI tutoring with multiple modes (teach, quiz, exam, revision, socratic, homework)
- **Smart Memory System** - AI remembers conversations, learning preferences, and provides personalized recommendations
- **Flashcards** - Create, study, and review flashcards with spaced repetition
- **Quizzes** - Take quizzes across various subjects with instant feedback
- **Study Plans** - Create and track study schedules
- **Analytics** - Detailed progress tracking and performance insights
- **Community** - Student chat rooms and collaboration features
- **Library** - Educational resources and AI-powered tools

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Row Level Security + Realtime)
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd eduverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase project dashboard under Settings > API.

### 4. Run database migrations

The migrations are located in `supabase/migrations/`. Apply them to your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_add_recent_conversations.sql`
   - `004_add_memory_rls_policies.sql`

### 5. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── ai-tutor/        # AI tutoring interface
│   ├── analytics/      # Progress tracking
│   ├── auth/           # Authentication pages
│   ├── community/      # Chat and collaboration
│   ├── dashboard/      # Main dashboard
│   ├── flashcards/     # Flashcard system
│   ├── layout/         # Navigation components
│   ├── library/        # Educational resources
│   ├── memory/         # AI memory management
│   ├── quizzes/        # Quiz system
│   ├── settings/       # User settings
│   ├── study-plan/     # Study planning
│   ├── subjects/       # Subject browser
│   └── ui/             # Shared UI components
├── contexts/
│   ├── AIMemoryContext.tsx  # AI memory state management
│   └── AuthContext.tsx      # Authentication state
├── lib/
│   └── supabase.ts     # Supabase client
├── types/
│   └── index.ts        # TypeScript types
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Database Schema

The app uses these main tables:

- `profiles` - User profiles and preferences
- `subjects` - Available subjects
- `quizzes` / `questions` / `quiz_attempts` - Quiz system
- `flashcards` - Flashcard collection
- `study_plans` - Study schedules
- `ai_memories` - AI conversation memory
- `learning_profiles` - User learning preferences
- `recent_conversations` - Conversation history

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Deployment

### Build for production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy options

- **Vercel**: Connect your GitHub repo, set environment variables
- **Netlify**: Same process, drag & drop `dist/` folder works too
- **Cloudflare Pages**: Connect repo, set build command to `npm run build`

Remember to set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in your deployment platform.

## License

MIT

---

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-mzyxmaca)
