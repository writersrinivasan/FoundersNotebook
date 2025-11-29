# 🚀 Founder's Note MVP - Setup Guide

## Complete Setup Instructions

Follow these steps to get your Founder's Note MVP up and running.

---

## Step 1: Prerequisites

Make sure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm or yarn
- ✅ Git
- ✅ Code editor (VS Code recommended)

---

## Step 2: Database Setup (Choose One)

### Option A: Supabase (Recommended - Easiest)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name: `founders-note`
   - Set a strong database password
   - Choose a region close to you

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the "Connection string" under "Connection Pooling"
   - It looks like: `postgresql://postgres.[xxx]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

3. **Enable pgvector Extension**
   - Go to SQL Editor in Supabase
   - Run this SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Option B: Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14

   # Ubuntu/Debian
   sudo apt-get install postgresql-14

   # Windows
   # Download from postgresql.org
   ```

2. **Create Database**
   ```bash
   createdb founders_note
   ```

3. **Connection String**
   ```
   postgresql://localhost:5432/founders_note
   ```

---

## Step 3: Authentication Setup (Clerk)

1. **Create Clerk Account**
   - Go to [clerk.com](https://clerk.com)
   - Sign up for free
   - Create a new application: "Founder's Note"

2. **Configure URLs**
   - In Clerk Dashboard → Paths:
     - Sign-in URL: `/sign-in`
     - Sign-up URL: `/sign-up`
     - After sign-in: `/dashboard`
     - After sign-up: `/onboarding`

3. **Get API Keys**
   - Go to API Keys tab
   - Copy:
     - `Publishable key` (starts with `pk_test_...`)
     - `Secret key` (starts with `sk_test_...`)

---

## Step 4: OpenAI API Setup

1. **Create OpenAI Account**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in
   - Add payment method (required for API access)

2. **Get API Key**
   - Go to API Keys
   - Click "Create new secret key"
   - Name it: "Founders Note MVP"
   - Copy the key (starts with `sk-...`)
   - **Important**: Save it immediately, you won't see it again!

3. **Set Usage Limits** (Optional but Recommended)
   - Go to Settings → Usage limits
   - Set a monthly limit (e.g., $50) to prevent surprises

---

## Step 5: Project Setup

1. **Navigate to Project**
   ```bash
   cd /Users/srinivasanramanujam/Documents/AgenticAI/homeWorkApp/founders-note
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

4. **Fill in Environment Variables**

Open `.env` and update:

```bash
# Database
DATABASE_URL="your_supabase_or_local_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# OpenAI
OPENAI_API_KEY=sk-...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Encryption key (generate a random 32-character string)
ENCRYPTION_KEY=generate_random_32_chars_here
```

**Generate Encryption Key**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 6: Database Migration

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```

   This will create all tables in your database.

3. **Verify** (Optional)
   ```bash
   npx prisma studio
   ```
   This opens a GUI to view your database at `http://localhost:5555`

---

## Step 7: Run the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

3. **Test Authentication**
   - Click "Sign Up"
   - Create an account with email
   - You should be redirected to `/onboarding` (will show 404 for now - that's expected!)

---

## Step 8: Test the Daily Note Generation

1. **Access Dashboard**
   - Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

2. **Generate First Note**
   - Click "Generate Today's Note"
   - Wait 10-30 seconds (AI is processing)
   - You'll see your first AI-generated daily note!

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Invalid DATABASE_URL"
- Check your connection string format
- For Supabase, use the "Connection Pooling" string, not "Direct connection"
- Make sure password is URL-encoded if it contains special characters

### "Clerk not configured"
- Double-check your Clerk API keys in `.env`
- Make sure keys start with `pk_test_` and `sk_test_`
- Restart dev server after changing `.env`

### "OpenAI API Error"
- Verify your API key is correct
- Check you have credits in OpenAI account
- Check rate limits at platform.openai.com

### Database Connection Issues
- For Supabase: Check project is not paused
- For local: Ensure PostgreSQL is running (`brew services list`)
- Test connection: `psql $DATABASE_URL`

---

## Next Steps

Now that your MVP is running:

1. **Create Test Data**
   - Add some tasks manually in Prisma Studio
   - Create some calendar events (or integrate Google Calendar)
   - Add company metrics

2. **Test AI Features**
   - Generate daily notes with different data
   - Check the quality of AI responses
   - Iterate on prompts in `lib/ai.ts`

3. **Build Missing Features**
   - Onboarding flow (`/app/onboarding`)
   - Task management UI
   - Calendar integration
   - Email delivery

4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - Update environment variables
   - Test live version

---

## Development Workflow

```bash
# Start dev server
npm run dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Update database schema
# 1. Edit prisma/schema.prisma
# 2. Run:
npx prisma db push

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start
```

---

## Useful Commands

```bash
# View database
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate

# Format Prisma schema
npx prisma format

# View logs
npm run dev | grep -i error
```

---

## Cost Tracking

Monitor your costs:

- **OpenAI**: [platform.openai.com/usage](https://platform.openai.com/usage)
- **Supabase**: Dashboard → Usage
- **Clerk**: Dashboard → Usage

Set up billing alerts to avoid surprises!

---

## Getting Help

If you run into issues:

1. Check the error message carefully
2. Look in browser console (F12)
3. Check terminal logs
4. Verify all environment variables
5. Restart dev server
6. Clear `.next` folder: `rm -rf .next && npm run dev`

---

## Ready to Deploy?

Once everything works locally, see `DEPLOYMENT.md` for production deployment instructions.

**Happy Building! 🚀**
