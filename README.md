# Student_Repo — Kerala Student Academic Resource Platform

**Student_Repo** is a fast, minimal, calm, and distraction-free academic repository designed specifically for Kerala State Board (SCERT / DHSE) students and teachers.

---

## 🌟 Key Features

1. **Curriculum Information Architecture:**
   - Classes 8, 9, 10 (SSLC), Plus One (Class 11), and Plus Two (Class 12).
   - Science, Commerce, and Humanities streams with subject breakdowns.
   - Previous Year Question Papers paired directly with official scoring schemes & answer keys.
2. **In-Browser Document Previewer:**
   - Read and preview study materials and PDFs directly before downloading.
   - Zoom controls and page-by-page inspection.
3. **Advanced Filter & Search Library:**
   - Filter by academic class, stream, resource category (Revision Notes, Model Papers, Lab Manuals, Worksheets).
   - Search-as-you-type with URL query state persistence (`/explore?class=plus-two&type=notes`).
4. **Teacher Verification & Reputation Leaderboard:**
   - Verified educator badges distinguishing authorized teacher summaries and question archives.
   - Fair community reputation formula based on peer ratings, saves, and helpfulness rather than raw download counts.
5. **Study Productivity Suite:**
   - Personal study planner for tracking revision goals.
   - Board Exam countdown tool.
6. **Student & Educator Upload Flow:**
   - Multi-step upload workflow with file validation, metadata categorization, and rights declarations.
   - Managed moderation lifecycle (`pending_review`, `approved`, `rejected`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup (Supabase)
1. Run the migration script in `supabase/migrations/20261010_initial_schema.sql` inside your Supabase SQL Editor.
2. Run `supabase/seed.sql` to populate Kerala State Board classes, subjects, streams, and taxonomy.
3. Set up the private `resources` storage bucket and public `avatars` bucket.

### 4. Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔒 Security & Row Level Security (RLS)
- Public users can view only approved resources.
- Uploaded materials default to `pending_review` and are only published after moderation.
- Ratings, bookmarks, study tasks, and exam dates are protected with user-scoped RLS policies.
- Privileged operations and audit logs are strictly restricted to admin roles.

---

## 🚢 Deploying to Vercel
1. Push repository to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Add the environment variables from `.env.example` in Project Settings -> Environment Variables.
4. Deploy! The application uses standard Next.js App Router and Turbopack.
