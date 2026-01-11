-- Drop existing RESTRICTIVE policies on profiles table
DROP POLICY IF EXISTS "Usuarios podem ver proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios podem inserir proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios podem atualizar proprio perfil" ON public.profiles;

-- Create PERMISSIVE policies for profiles table
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);