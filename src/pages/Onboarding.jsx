// src/pages/Onboarding.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Onboarding() {
  const navigate = useNavigate()
  const { register, login } = useStore()
  const [mode, setMode] = useState('welcome') // welcome | register | login
  const [form, setForm] = useState({ name: '', phone: '', business_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (!form.name || !form.phone) return setError('Completa todos los campos')
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/app')
    } catch (e) {
      setError('Hubo un error. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!form.phone) return setError('Ingresa tu número')
    setLoading(true)
    setError('')
    try {
      await login(form.phone)
      navigate('/app')
    } catch (e) {
      setError('Número no encontrado. ¿Ya tienes cuenta?')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'welcome') return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--verde)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px 28px 48px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 280, height: 280, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
      }} />
      <div style={{
        position: 'absolute', left: -80, bottom: 120,
        width: 220, height: 220, borderRadius: '50%',
        background: 'rgba(245,200,66,0.08)',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 36,
          fontWeight: 900,
          color: 'var(--amarillo)',
          marginBottom: 4,
        }}>Parva.</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          SheShips Hackathon 2026
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 48,
          fontWeight: 900,
          color: 'white',
          lineHeight: 1,
          marginBottom: 20,
        }}>
          La plata<br />que te<br />
          <span style={{ color: 'var(--amarillo)', fontStyle: 'italic' }}>cuida.</span>
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 16,
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: 40,
        }}>
          Cobra, vende, organiza tu negocio<br />
          y cubre tu salud — todo desde el celular.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn-primary" style={{ background: 'var(--amarillo)', color: 'var(--tinta)' }}
            onClick={() => setMode('register')}>
            Empezar gratis
          </button>
          <button className="btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            onClick={() => setMode('login')}>
            Ya tengo cuenta
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 20, justifyContent: 'center',
        position: 'relative',
      }}>
        {['📱 Solo celular', '💚 Sin banco', '🏥 Seguro incluido'].map(t => (
          <span key={t} style={{
            fontSize: 11, color: 'rgba(255,255,255,0.5)',
            textAlign: 'center', lineHeight: 1.4,
          }}>{t}</span>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--crema)', padding: '60px 24px 40px' }}>
      <button onClick={() => setMode('welcome')}
        style={{ background: 'none', border: 'none', fontSize: 24, marginBottom: 32, cursor: 'pointer' }}>
        ←
      </button>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, marginBottom: 8 }}>
        {mode === 'register' ? '¡Bienvenida!' : 'Hola de nuevo'}
      </h2>
      <p style={{ color: 'var(--gris-medio)', fontSize: 15, marginBottom: 32, fontWeight: 300 }}>
        {mode === 'register'
          ? 'Crea tu cuenta en segundos. Solo necesitas tu nombre y celular.'
          : 'Ingresa tu número de celular para entrar.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mode === 'register' && (
          <>
            <div>
              <label className="label">Tu nombre</label>
              <input className="input-field" placeholder="Ej: Valentina Torres"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Nombre de tu negocio</label>
              <input className="input-field" placeholder="Ej: Ropa Val Style"
                value={form.business_name}
                onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} />
            </div>
          </>
        )}
        <div>
          <label className="label">Número de celular</label>
          <input className="input-field" placeholder="Ej: 3001234567" type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>

        {error && (
          <p style={{ color: 'var(--rosa)', fontSize: 14, textAlign: 'center' }}>{error}</p>
        )}

        <button className="btn-primary" style={{ marginTop: 8 }}
          onClick={mode === 'register' ? handleRegister : handleLogin}
          disabled={loading}>
          {loading ? 'Cargando...' : mode === 'register' ? 'Crear mi cuenta' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}
