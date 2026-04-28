-- seed.sql

INSERT INTO public.experiences (title, description, location, time, capacity, container_type) VALUES
('Quiet Dinner in Hayes Valley', 'A small, low-pressure dinner for people settling into the city.', 'Hayes Valley', NOW() + INTERVAL '2 days', 5, 'Grounding'),
('Morning Trail Walk', 'Fresh air and casual conversation outside the city noise.', 'Marin Headlands', NOW() + INTERVAL '3 days', 6, 'Grounding'),
('Founders Celebration Drinks', 'Rooftop drinks to celebrate milestones, big or small.', 'Mission District', NOW() + INTERVAL '1 day', 6, 'Celebratory'),
('Pottery Studio Session', 'Hands busy, low noise, casual connection.', 'The Mission', NOW() + INTERVAL '4 days', 5, 'Creative/Release'),
('Late Night Jazz & Wind Down', 'Soft music and reflective conversations.', 'North Beach', NOW() + INTERVAL '2 days', 4, 'Grounding'),
('Product Launch Afterparty', 'High energy celebration for those who just shipped.', 'SOMA', NOW() + INTERVAL '12 hours', 15, 'Celebratory'),
('Breathwork & Integration', 'A guided session to release tension and process the week.', 'Dolores Park', NOW() + INTERVAL '5 days', 8, 'Release'),
('Sunday Startup Brunch', 'Casual networking and ideation over coffee and eggs.', 'Marina District', NOW() + INTERVAL '6 days', 6, 'Energy'),
('Sunset Golden Hour Hike', 'A beautiful, vigorous hike ending with an ocean sunset.', 'Mount Tamalpais', NOW() + INTERVAL '1 week', 8, 'Physical/Release');
