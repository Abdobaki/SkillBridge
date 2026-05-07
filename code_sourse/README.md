# SkillBridge

A professional job and training platform built with React, TypeScript, and Supabase. SkillBridge connects job seekers with opportunities, trainers with students, and administrators with management tools.

## Features

- **Job Browsing & Applications** – Browse, save, and apply to job announcements
- **Course Discovery** – Explore professional courses from verified trainers
- **Trainer Dashboard** – Trainers can propose courses, browse jobs, and manage enrollments
- **Admin Panel** – Approve/reject trainer applications, job posts, and course proposals
- **Google OAuth & Email Auth** – Secure authentication via Supabase Auth
- **Deadline Reminders** – Automated email reminders for job application deadlines
- **Mobile App** – Android app via Capacitor

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Radix UI, MUI
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **Mobile:** Capacitor (Android)
- **Build Tool:** Vite

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main application with routing
│   ├── types.ts             # TypeScript type definitions
│   └── components/          # UI components (screens, forms, navigation)
├── lib/
│   ├── api.ts               # Supabase API functions
│   └── supabase.ts          # Supabase client configuration
└── styles/                  # CSS stylesheets
```