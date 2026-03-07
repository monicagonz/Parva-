// src/pages/NewSale.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Check } from 'lucide-react'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

export default function NewSale() {
  const navigate = useNavigate()
  const { addSale } = useStore()
  const [form, setForm] = useState({ amount: '', description: '', category: 'negocio' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { sale, insurance, net }
  const [error, setError] = useState('')

  const insurance = form.amount ? Math.round(Number(form.amount) * 0.025) : 0
  const net       = form.amount ? Number(form.amount) - insurance : 0

  const handleSubmit = async () => {
    if (!form.amount || !form.description) return setError('Completa monto y descripción')
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) return setError('Ingresa un monto válido')
    setLoading(true)
    setError('')
    try {
      const res = await addSale({
        amount: Number(form.amount),
        description: form.description,
        category: form.category,
      })
      setResult(res)
    } catch (e) {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--verde)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      {/* Checkmark animado */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--amarillo)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        animation: 'pop 0.4s ease',
      }}>
        <Check size={40} color="var(--tinta)" strokeWidth={3} />
      </div>

      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 32, color: 'white',
        marginBottom: 8,
      }}>¡Venta registrada!</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 40, fontWeight: 300 }}>
        {form.description}
      </p>

      {/* Desglose */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '24px',
        width: '100%', maxWidth: 320,
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>Total cobrado</span>
          <span style={{ color: 'white', fontWeight: 600 }}>{fmt(result.sale.amount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>💚 Aporte a tu seguro</span>
          <span style={{ color: 'var(--amarillo)', fontWeight: 600 }}>-{fmt(result.insurance)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Te queda limpio</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 24, color: 'var(--amarillo)', fontWeight: 700,
          }}>{fmt(result.net)}</span>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 32, maxWidth: 260 }}>
        El 2.5% fue automáticamente a tu fondo de salud. ¡Así de fácil te cuidas! 🏥
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <button className="btn-primary"
          style={{ background: 'var(--amarillo)', color: 'var(--tinta)' }}
          onClick={() => { setResult(null); setForm({ amount: '', description: '', category: 'negocio' }) }}>
          Registrar otra venta
        </button>
        <button className="btn-secondary"
          style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          onClick={() => navigate('/app')}>
          Ver mi dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate('/app')}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, marginBottom: 16, cursor: 'pointer' }}>
          ←
        </button>
        <h1>Nueva venta</h1>
        <p>Registra lo que vendiste hoy</p>
      </div>

      <div className="page-body">
        {/* Monto */}
        <div className="card">
          <label className="label">¿Cuánto cobraste?</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--verde)',
            }}>$</span>
            <input
              className="input-field"
              style={{ paddingLeft: 36, fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700 }}
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            />
          </div>

          {/* Preview desglose en tiempo real */}
          {form.amount > 0 && (
            <div style={{
              marginTop: 12, padding: '12px 16px',
              background: 'var(--crema)', borderRadius: 12,
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--rosa)', fontWeight: 600 }}>💚 Seguro</div>
                <div style={{ fontWeight: 700, marginTop: 2 }}>{fmt(insurance)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--gris-medio)', fontWeight: 600 }}>Te queda</div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 18, fontWeight: 700, color: 'var(--verde)', marginTop: 2,
                }}>{fmt(net)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="card">
          <label className="label">¿Qué vendiste?</label>
          <input
            className="input-field"
            placeholder="Ej: Blusa rosada talla M"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        {/* Categoría */}
        <div className="card">
          <label className="label">¿Para qué fue el dinero?</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { value: 'negocio', label: 'Mi negocio', emoji: '🛍️' },
              { value: 'hogar',   label: 'El hogar',   emoji: '🏠' },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setForm(f => ({ ...f, category: opt.value }))}
                style={{
                  padding: '16px 12px',
                  borderRadius: 12,
                  border: `2px solid ${form.category === opt.value ? 'var(--verde)' : '#e2ddd5'}`,
                  background: form.category === opt.value ? 'var(--verde-bg)' : 'white',
                  fontSize: 14, fontWeight: 500,
                  color: form.category === opt.value ? 'var(--verde)' : 'var(--tinta)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.emoji}</div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--rosa)', fontSize: 14, textAlign: 'center' }}>{error}</p>
        )}

        <button className="btn-primary" 
          onClick={() => {
            if (!form.amount || !form.description) return setError('Completa monto y descripción')
            navigate('/app/qr', { 
              state: { 
                amount: Number(form.amount), 
                description: form.description, 
                category: form.category 
              } 
            })
          }}
          style={{ marginTop: 8 }}>
          Generar QR de cobro 
        </button>
      </div>
    </div>
  )
}
