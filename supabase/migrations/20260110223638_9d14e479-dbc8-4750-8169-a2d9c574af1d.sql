-- =============================================
-- FINANCIFY DATABASE SCHEMA
-- =============================================

-- 1. Create categorias table
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  cor TEXT DEFAULT '#6366F1',
  icone TEXT DEFAULT 'tag',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create parcelamentos table
CREATE TABLE public.parcelamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  descricao TEXT NOT NULL,
  valor_total NUMERIC(12,2) NOT NULL,
  valor_parcela NUMERIC(12,2) NOT NULL,
  parcelas_pagas INTEGER DEFAULT 0,
  total_parcelas INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'quitado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create assinaturas table
CREATE TABLE public.assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  frequencia TEXT NOT NULL CHECK (frequencia IN ('mensal', 'trimestral', 'semestral', 'anual')),
  dia_cobranca INTEGER NOT NULL CHECK (dia_cobranca BETWEEN 1 AND 31),
  data_inicio DATE NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on categorias
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own categorias" ON public.categorias
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on parcelamentos
ALTER TABLE public.parcelamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own parcelamentos" ON public.parcelamentos
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on assinaturas
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own assinaturas" ON public.assinaturas
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

CREATE INDEX idx_parcelamentos_user ON public.parcelamentos(user_id);
CREATE INDEX idx_parcelamentos_status ON public.parcelamentos(user_id, status);
CREATE INDEX idx_assinaturas_user ON public.assinaturas(user_id);
CREATE INDEX idx_assinaturas_status ON public.assinaturas(user_id, status);
CREATE INDEX idx_categorias_user ON public.categorias(user_id);

-- =============================================
-- TRIGGER FOR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_parcelamentos
  BEFORE UPDATE ON public.parcelamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_assinaturas
  BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();