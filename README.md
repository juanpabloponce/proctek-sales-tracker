# PROCTEK Sales Tracker

Sales daily tracking application for PROCTEK UAE 2026.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Supabase (Database)
- EmailJS (Notifications)

## Deploy to Vercel

### Option 1: GitHub + Vercel (Recommended)

1. Create a new GitHub repository
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/proctek-sales-tracker.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com)
4. Click "Add New Project"
5. Import your GitHub repository
6. Click "Deploy"

### Option 2: Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Local Development

```bash
npm install
npm run dev
```

## Configuration

The app is pre-configured with:
- Supabase URL and key
- EmailJS credentials
- User data in Supabase

## Features
- Daily scorecard tracking
- Weekly summaries
- Team dashboard (admin)
- Email notifications on report submission
- Glassmorphism UI design
