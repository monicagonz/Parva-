# 🌱 Parva — La plata que te cuida

> Neo-banca todo-en-uno para mujeres emprendedoras informales en LATAM.
> SheShips Global Hackathon 2026

---

## 🚀 Setup en 15 minutos

### 1. Clonar e instalar
```bash
git clone <tu-repo>
cd parva
npm install
```

### 2. Crear proyecto en Supabase (gratis)
1. Ir a [supabase.com](https://supabase.com) → New project
2. Ir a **SQL Editor** → New query → pegar y ejecutar:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT DEFAULT 'Mi Negocio',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'negocio',
  insurance_amount DECIMAL,
  net_amount DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  stock INT DEFAULT 0,
  emoji TEXT DEFAULT '📦',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE insurance_fund (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Políticas permisivas para hackathon
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_fund ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON users FOR ALL USING (true);
CREATE POLICY "allow all" ON sales FOR ALL USING (true);
CREATE POLICY "allow all" ON inventory FOR ALL USING (true);
CREATE POLICY "allow all" ON insurance_fund FOR ALL USING (true);
```

3. Ir a **Settings → API** → copiar `Project URL` y `anon public key`

### 3. Variables de entorno
```bash
cp .env.example .env
```
Editar `.env` con tus keys:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_FEATHERLESS_API_KEY=fl-...
VITE_ELEVENLABS_API_KEY=sk_...   # opcional
```

### 4. Correr local
```bash
npm run dev
# Abre http://localhost:5173
```

---

## 🌐 Deploy en Vercel (5 minutos)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Seguir las instrucciones:
# - Set up and deploy? Y
# - Which scope? (tu cuenta)
# - Link to existing project? N
# - Project name: parva
# - Directory: ./
# - Override settings? N
```

Luego en Vercel dashboard → Settings → Environment Variables:
- Agregar las mismas variables del `.env`

```bash
# Deploy a producción
vercel --prod
```

**¡Listo! Tienes un link público.**

---

## 🛠️ Tecnologías
- **React + Vite** — Frontend
- **Supabase** — Base de datos + autenticación
- **Featherless.ai** — Coach IA (Llama 3.3 70B)
- **ElevenLabs** — Voz del coach (opcional)
- **Vercel** — Deploy

---

## 💡 Flujo del demo

1. **Registro** → solo nombre + celular, sin banco
2. **Nueva venta** → monto + descripción → ver desglose automático
3. **Seguro automático** → 2.5% de cada venta al fondo de salud
4. **Dashboard** → negocio vs hogar, fondo acumulado
5. **Coach IA** → pregunta en español, responde con tus datos reales + voz

---

## 🤝 El problema que resuelve

+30M de mujeres en LATAM venden por WhatsApp e Instagram sin herramientas financieras.
Mezclan el dinero del hogar con el del negocio, pagan comisiones abusivas y no tienen seguro de salud.

**Parva** les da:
- Cobro simple por QR / link
- Separación automática negocio vs hogar
- Seguro de salud que se paga solo con cada venta (2.5%)
- Coach financiero con IA en español

---

*Construido en 37 horas · SheShips Hackathon 2026*
