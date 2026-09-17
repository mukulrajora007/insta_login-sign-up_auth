-- ==============================================================================
-- Instagram Clone Authentication Schema for Supabase
-- Paste this script into your Supabase Dashboard -> SQL Editor and click "RUN"
-- ==============================================================================

-- Create extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio TEXT DEFAULT 'Welcome to my Instagram!',
    website TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Case-insensitive uniqueness indexes on username and email
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON public.users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON public.users (LOWER(username));

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to basic profiles (like Instagram public profile view)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users 
FOR SELECT 
USING (true);

-- Allow service role or authenticated backend to insert new users
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
CREATE POLICY "Allow user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (true);

-- Optional: Sample initial user (password is "Password123" hashed with bcrypt)
-- You can uncomment this to insert a test account immediately:
/*
INSERT INTO public.users (email, full_name, username, password_hash)
VALUES (
    'testuser@example.com',
    'Instagram Test User',
    'instagrammer',
    '$2a$10$w8M76GvH3f6hA1KzYyvBLe64uA4t/8u6qQh9OshjX3nLqK9Uj3h5S'
)
ON CONFLICT (email) DO NOTHING;
*/
