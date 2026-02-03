-- Update the SELECT policy on proposals to allow admins to see all proposals
DROP POLICY IF EXISTS "Users can view their own proposals" ON public.proposals;

CREATE POLICY "Users can view proposals" 
ON public.proposals 
FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.is_admin(auth.uid())
);