# Curated Hub

## منصة مجتمعية عربية قائمة على الاهتمامات

Arabic social media platform where users can share posts, connect based on interests, and engage with a vibrant community.

## How to Run Locally

Follow these steps to run the project on your machine:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd curated-hub-main

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Technologies Used

This project is built with:

- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS
- **Supabase** - Database & Authentication

## Environment Setup

This project uses Supabase for backend services. The environment variables are already configured in `.env`:

```bash
VITE_SUPABASE_URL=https://jjltizbgsmahfqjgrceu.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_y94BY29QOX6S3esLX354OA_w-Hxvrnd
```

**Note:** These are public anon keys and work with Row Level Security (RLS).

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## How to Deploy

See the comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide for:
- Environment variable setup
- Supabase Storage configuration
- Deployment to Vercel, Netlify, or other platforms
- Security checklist

### Quick Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Features

- ✅ User authentication with Supabase
- ✅ Interest-based content filtering
- ✅ Create posts with images
- ✅ Like and comment on posts
- ✅ User profiles with customizable avatars
- ✅ Trending interests & active users widgets
- ✅ Pagination for better performance
- ✅ Share posts to social media
- ✅ RTL support for Arabic content

## License

MIT


