-- Drop existing RESTRICTIVE policy on assinaturas table
DROP POLICY IF EXISTS "Users manage own assinaturas" ON public.assinaturas;

-- Create PERMISSIVE policies for assinaturas table
CREATE POLICY "Users can view own assinaturas" 
ON public.assinaturas 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assinaturas" 
ON public.assinaturas 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assinaturas" 
ON public.assinaturas 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assinaturas" 
ON public.assinaturas 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);