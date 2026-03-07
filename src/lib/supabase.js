// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ─────────────────────────────────────────────
// PEGA ESTO EN: Supabase → SQL Editor → New query
// ─────────────────────────────────────────────
/*
-- 1. Usuarias
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT DEFAULT 'Mi Negocio',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Ventas
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'negocio',   -- 'negocio' | 'hogar'
  insurance_amount DECIMAL,          -- 2.5% automático
  net_amount DECIMAL,                -- 97.5%
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Inventario
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  stock INT DEFAULT 0,
  emoji TEXT DEFAULT '📦',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Fondo seguro
CREATE TABLE insurance_fund (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Datos demo (reemplaza el UUID con el de tu usuaria creada)
-- Primero crea la usuaria desde la app, luego copia su ID aquí.

-- HABILITAR ROW LEVEL SECURITY (RLS) - modo permisivo para hackathon
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_fund ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON users FOR ALL USING (true);
CREATE POLICY "allow all" ON sales FOR ALL USING (true);
CREATE POLICY "allow all" ON inventory FOR ALL USING (true);
CREATE POLICY "allow all" ON insurance_fund FOR ALL USING (true);
*/
