-- Add role to profiles
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Update RLS for profiles: Users can see themselves, admins can see all
DROP POLICY IF EXISTS "Allow all operations for public" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner and admins" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Profiles are updatable by owner and admins" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Update RLS for experiences: Only admins can insert/update/delete
DROP POLICY IF EXISTS "Allow all operations for public" ON public.experiences;
CREATE POLICY "Experiences are viewable by everyone" 
ON public.experiences FOR SELECT 
USING (true);

CREATE POLICY "Experiences are manageable by admins only" 
ON public.experiences FOR ALL 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Update RLS for voice_sessions: Only owner and admins
DROP POLICY IF EXISTS "Allow all operations for public" ON public.voice_sessions;
CREATE POLICY "Voice sessions are viewable by owner and admins" 
ON public.voice_sessions FOR SELECT 
USING (profile_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Update RLS for matches
DROP POLICY IF EXISTS "Allow all operations for public" ON public.matches;
CREATE POLICY "Matches are viewable by participants and admins" 
ON public.matches FOR SELECT 
USING (profile_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
