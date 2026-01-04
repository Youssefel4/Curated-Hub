# 🚀 Deployment Guide - Curated Hub

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup

Your project uses environment variables stored in `.env` file. For production deployment:

#### Current Setup
- ✅ `.env` file exists with Supabase credentials
- ✅ `.gitignore` already ignores `*.local` files
- ✅ Credentials are configured for project: `jjltizbgsmahfqjgrceu.supabase.co`

#### For Local Development
If you want to create a separate `.env.local` file for local development:

```bash
# Create .env.local (optional - already covered by .env)
cp .env .env.local
```

**Note:** The `.gitignore` file already has `*.local` pattern, so `.env.local` won't be committed.

### 2. Supabase Storage Setup

Before deploying, you **MUST** set up the Storage bucket:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage**
3. Create new bucket named `images`
4. Set it to **Public**
5. Run the SQL from `supabase/migrations/20260104_add_storage.sql`

### 3. Database Migrations

Ensure all migrations are applied:

```bash
# migrations/20260104125850_22871719-9c37-427c-914b-fdfcea9efe2a.sql ✅
# migrations/20260104125913_59064945-a2cd-4d2b-a0d4-a2563e0709c9.sql ✅
# migrations/20260104_add_storage.sql ⚠️ (needs manual setup)
```

### 4. Build the Project

Test the production build:

```bash
npm run build
```

This will create a `dist` folder ready for deployment.

### 5. Environment Variables in Production

When deploying to platforms like Vercel, Netlify, or others, add these environment variables:

```
VITE_SUPABASE_URL=https://jjltizbgsmahfqjgrceu.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_y94BY29QOX6S3esLX354OA_w-Hxvrnd
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Deploy!

### Option 2: Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables
7. Deploy!

**Important for Netlify:** Ensure you have the `public/_redirects` file created (I've added it for you) to prevent 404 errors on refresh.

### Option 3: GitHub Pages

```bash
npm run build
# Use gh-pages package or manual deployment to GitHub Pages
```

### Option 4: Any Static Hosting

Build the project and upload the `dist` folder to any static hosting service:

```bash
npm run build
# Upload the dist folder to your hosting provider
```

---

## 🔐 Security Checklist

- [x] `.env.local` is in `.gitignore` (via `*.local` pattern)
- [x] `.env` file contains public Supabase keys (safe to use)
- [x] Supabase RLS policies are enabled on all tables
- [x] Storage bucket policies restrict uploads to authenticated users
- [ ] Set up Supabase Storage bucket before deployment

---

## 📝 Important Files

| File | Purpose | Should Commit? |
|------|---------|----------------|
| `.env` | Contains Supabase config | ✅ Yes (public keys only) |
| `.env.local` | Local overrides | ❌ No (in .gitignore) |
| `.env.local.example` | Template for others | ✅ Yes |

---

## 🎯 Final Steps Before Going Live

1. ✅ Test locally: `npm run dev`
2. ✅ Build successfully: `npm run build`
3. ⚠️ Set up Supabase Storage bucket
4. ⚠️ Configure environment variables in hosting platform
5. ⚠️ Deploy and test!

---

> [!TIP]
> Your Supabase credentials in `.env` are **public anon keys** which are safe to use client-side. They work with Row Level Security (RLS) to protect your data.

> [!WARNING]
> Don't forget to create the `images` Storage bucket in Supabase Dashboard before using image upload features!
