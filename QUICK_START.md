# ✅ Quick Start Checklist

Follow this checklist to get Founder's Note running in 15 minutes.

---

## Pre-Flight Check

- [ ] Node.js 18+ installed
- [ ] Code editor open
- [ ] Terminal ready
- [ ] Coffee/tea in hand ☕

---

## Step 1: Accounts Setup (5 minutes)

### Create Accounts
- [ ] **Supabase**: [supabase.com](https://supabase.com) → New Project
- [ ] **Clerk**: [clerk.com](https://clerk.com) → New Application
- [ ] **OpenAI**: [platform.openai.com](https://platform.openai.com) → Add payment method

### Get Credentials
- [ ] Copy Supabase connection string (Project Settings → Database)
- [ ] Copy Clerk publishable key
- [ ] Copy Clerk secret key
- [ ] Copy OpenAI API key

---

## Step 2: Project Setup (2 minutes)

```bash
# Navigate to project
cd founders-note

# Install dependencies
npm install
```

- [ ] Dependencies installed

---

## Step 3: Environment Configuration (3 minutes)

```bash
# Copy environment template
cp .env.example .env

# Open .env in your editor
code .env  # or vim .env, nano .env, etc.
```

### Fill in these values:
- [ ] `DATABASE_URL` (from Supabase)
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (from Clerk)
- [ ] `CLERK_SECRET_KEY` (from Clerk)
- [ ] `OPENAI_API_KEY` (from OpenAI)
- [ ] `ENCRYPTION_KEY` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

---

## Step 4: Database Setup (2 minutes)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

- [ ] Prisma client generated
- [ ] Database schema pushed

---

## Step 5: Enable pgvector (1 minute)

In Supabase:
1. Go to SQL Editor
2. Run: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Click "Run"

- [ ] pgvector extension enabled

---

## Step 6: Launch! (2 minutes)

```bash
# Start development server
npm run dev
```

- [ ] Server running at localhost:3000
- [ ] No errors in terminal

---

## Step 7: Test the App

### Test Authentication
1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Sign Up"
3. Create account with email
4. Verify email in Clerk Dashboard (if required)

- [ ] Can sign up
- [ ] Can sign in
- [ ] Redirected to dashboard

### Test Dashboard
1. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. Click "Generate Today's Note"
3. Wait 10-30 seconds

- [ ] Dashboard loads
- [ ] Can click generate button
- [ ] Daily note appears

---

## ✅ Success Criteria

You're ready to build when:
- ✅ App runs without errors
- ✅ Authentication works
- ✅ Dashboard displays
- ✅ Daily note generates successfully
- ✅ No red errors in browser console

---

## 🐛 Quick Fixes

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Database connection failed"
- Check `DATABASE_URL` is correct
- Verify database is running (Supabase project not paused)
- Test: `psql $DATABASE_URL`

### "Clerk keys invalid"
- Double-check keys in `.env`
- Restart dev server: `Ctrl+C` then `npm run dev`

### "OpenAI API error"
- Verify API key
- Check account has credits
- Visit: platform.openai.com/usage

---

## 🎉 You're Done!

**Time taken**: ~15 minutes  
**Status**: MVP running locally  
**Next**: Start building features or deploy to production

---

## 📚 Next Steps

### Immediate
- [ ] Read `MVP_STATUS.md` for current progress
- [ ] Check `SETUP_GUIDE.md` for detailed docs
- [ ] Review `FOUNDERS_NOTE_FRAMEWORK.md` for product strategy

### This Week
- [ ] Create onboarding flow
- [ ] Add sample data for testing
- [ ] Start Google Calendar integration

### Next 2 Weeks
- [ ] Build task management UI
- [ ] Improve AI prompts
- [ ] Add more insights

---

## 🚀 Ready to Deploy?

When you're ready for production:

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main

# Deploy to Vercel
# 1. Import project in vercel.com
# 2. Add environment variables
# 3. Deploy!
```

---

## 💡 Pro Tips

1. **Use Prisma Studio** to inspect data:
   ```bash
   npm run db:studio
   ```

2. **Monitor AI costs** at platform.openai.com/usage

3. **Test with sample data** before connecting real calendar

4. **Keep terminal open** to see logs and errors

---

## ✅ Verification

Run this quick test to verify everything:

```bash
# Should return Prisma version
npx prisma -v

# Should return Next.js version
npx next -v

# Should show your Clerk keys
grep CLERK .env

# Should show your OpenAI key
grep OPENAI .env
```

---

**All set? Start building! 🎯**

Need help? Check the docs or review error messages carefully.

**Happy coding! 🚀**
