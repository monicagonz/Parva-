 // src/pages/QRCobro.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Share2, Copy } from 'lucide-react'
import { useStore } from '../store/useStore'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

export default function QRCobro() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, addSale } = useStore()
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Recibe los datos de la venta desde NewSale
  const { amount, description, category } = location.state || {
    amount: 50000,
    description: 'Producto',
    category: 'negocio',
  }

  const insurance = Math.round(amount * 0.025)
  const net = amount - insurance

  // Link de pago simulado
  const paymentLink = `https://parva-proyecto.vercel.app/pagar?monto=${amount}&para=${encodeURIComponent(user?.business_name || 'Parva')}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSimulatePay = async () => {
    setLoading(true)
    // Simular delay de pago
    await new Promise(r => setTimeout(r, 1500))
    
    try {
      await addSale({ amount, description, category })
      setPaid(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (paid) return (
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
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'var(--amarillo)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        animation: 'pop 0.4s ease',
      }}>
        <Check size={44} color="var(--tinta)" strokeWidth={3} />
      </div>

      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 36, color: 'white', marginBottom: 8,
      }}>¡Pago recibido!</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 36, fontWeight: 300 }}>
        {description}
      </p>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '24px',
        width: '100%', maxWidth: 320, marginBottom: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>Total cobrado</span>
          <span style={{ color: 'white', fontWeight: 600 }}>{fmt(amount)}</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: 14, paddingBottom: 14,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>💚 Tu seguro de salud</span>
          <span style={{ color: 'var(--amarillo)', fontWeight: 600 }}>-{fmt(insurance)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Te queda limpio</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 26, color: 'var(--amarillo)', fontWeight: 700,
          }}>{fmt(net)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <button className="btn-primary"
          style={{ background: 'var(--amarillo)', color: 'var(--tinta)' }}
          onClick={() => navigate('/app/venta')}>
          Cobrar de nuevo
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
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, marginBottom: 16, cursor: 'pointer' }}>
          ←
        </button>
        <h1>Cobrar</h1>
        <p>Muéstrale este QR a tu cliente</p>
      </div>

      <div className="page-body" style={{ alignItems: 'center' }}>
        {/* Monto */}
        <div style={{
          textAlign: 'center',
          padding: '20px 0 4px',
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 48, fontWeight: 900,
            color: 'var(--verde)', lineHeight: 1,
          }}>{fmt(amount)}</div>
          <p style={{ color: 'var(--gris-medio)', fontSize: 14, marginTop: 8 }}>{description}</p>
        </div>

        {/* QR */}
        <div className="card" style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '28px',
          width: '100%',
        }}>
          <div style={{
            padding: 16, background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            marginBottom: 16,
          }}>
            <QRCodeSVG
              value={paymentLink}
              size={200}
              fgColor="var(--tinta)"
              bgColor="white"
              level="M"
            />
          </div>
          <p style={{ fontSize: 13, color: 'var(--gris-medio)', textAlign: 'center' }}>
            Tu cliente escanea este QR y paga al instante
          </p>
        </div>

        {/* Desglose */}
        <div className="card" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--gris-medio)' }}>Total a cobrar</span>
            <span style={{ fontWeight: 600 }}>{fmt(amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--rosa)' }}>💚 Va a tu seguro (2.5%)</span>
            <span style={{ fontWeight: 600, color: 'var(--rosa)' }}>{fmt(insurance)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            paddingTop: 12, borderTop: '1px solid #ede9e0',
          }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Te queda limpio</span>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 20, fontWeight: 700, color: 'var(--verde)',
            }}>{fmt(net)}</span>
          </div>
        </div>

        {/* Copiar link */}
        <button onClick={handleCopyLink}
          style={{
            width: '100%', padding: '14px',
            background: copied ? 'var(--verde-bg)' : 'var(--gris)',
            border: `2px solid ${copied ? 'var(--verde)' : 'transparent'}`,
            borderRadius: 'var(--radio)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontSize: 14, fontWeight: 500,
            color: copied ? 'var(--verde)' : 'var(--tinta)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? '¡Link copiado!' : 'Copiar link de pago'}
        </button>

        {/* Botón simular pago — para el demo */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--gris-medio)', marginBottom: 10 }}>
            — Demo del hackathon —
          </p>
          <button className="btn-primary" onClick={handleSimulatePay} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Procesando pago...
              </span>
            ) : '✅ Simular pago recibido'}
          </button>
        </div>
      </div>
    </div>
  )
}