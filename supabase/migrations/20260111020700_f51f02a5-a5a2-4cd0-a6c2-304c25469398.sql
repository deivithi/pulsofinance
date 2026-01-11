-- 1. Adicionar DELETE policy para profiles
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- 2. Converter categorias para policies PERMISSIVE
DROP POLICY IF EXISTS "Users manage own categorias" ON public.categorias;

CREATE POLICY "Users can view own categorias"
ON public.categorias
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categorias"
ON public.categorias
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categorias"
ON public.categorias
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categorias"
ON public.categorias
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Converter parcelamentos para policies PERMISSIVE
DROP POLICY IF EXISTS "Users manage own parcelamentos" ON public.parcelamentos;

CREATE POLICY "Users can view own parcelamentos"
ON public.parcelamentos
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parcelamentos"
ON public.parcelamentos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parcelamentos"
ON public.parcelamentos
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own parcelamentos"
ON public.parcelamentos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);