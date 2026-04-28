-- 001_init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (Users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Core 3D Matching Dimensions
    current_emotional_state TEXT,
    current_life_chapter TEXT,
    current_social_energy TEXT,
    last_check_in TIMESTAMP WITH TIME ZONE
);

-- EXPERIENCES (Containers)
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INT DEFAULT 6,
    container_type TEXT, -- e.g., 'Grounding', 'Celebratory', 'Release'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VOICE SESSIONS (Check-ins)
CREATE TABLE public.voice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    extracted_emotion TEXT,
    extracted_chapter TEXT,
    extracted_energy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CIRCLES (Instantiated Groups for an Experience)
CREATE TABLE public.circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID REFERENCES public.experiences(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'activated', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MATCHES (Users invited to/confirmed for a Circle)
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'invited', -- 'invited', 'confirmed', 'declined'
    match_reason TEXT, -- "Why this fits you"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, circle_id)
);

-- SET UP ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Basic Policies (For DEV, we'll allow all. In Prod, lock this down)
CREATE POLICY "Allow all operations for public" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations for public" ON public.experiences FOR ALL USING (true);
CREATE POLICY "Allow all operations for public" ON public.voice_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations for public" ON public.circles FOR ALL USING (true);
CREATE POLICY "Allow all operations for public" ON public.matches FOR ALL USING (true);
