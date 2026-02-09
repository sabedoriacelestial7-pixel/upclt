
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Screenshots are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'screenshots');
