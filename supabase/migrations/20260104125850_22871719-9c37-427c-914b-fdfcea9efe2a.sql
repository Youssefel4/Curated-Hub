-- Create interests table
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default interests
INSERT INTO public.interests (name, icon, color) VALUES
  ('التصميم', 'Palette', 'design'),
  ('البرمجة', 'Code', 'programming'),
  ('التعليم', 'GraduationCap', 'education'),
  ('ريادة الأعمال', 'Briefcase', 'business'),
  ('الصحة', 'Heart', 'health'),
  ('الفنون', 'Brush', 'art'),
  ('التقنية', 'Laptop', 'programming'),
  ('الرياضة', 'Dumbbell', 'health'),
  ('الطبخ', 'ChefHat', 'art'),
  ('السفر', 'Plane', 'business');

-- Enable RLS on interests (public read)
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Interests are viewable by everyone"
  ON public.interests FOR SELECT
  USING (true);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create user_interests junction table
CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, interest_id)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User interests are viewable by everyone"
  ON public.user_interests FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own interests"
  ON public.user_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests"
  ON public.user_interests FOR DELETE
  USING (auth.uid() = user_id);

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Create likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();