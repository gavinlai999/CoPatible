-- Add profile photo, bio and social links (Phase 2 profile feature)

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS snapchat TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT;
