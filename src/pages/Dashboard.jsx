// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Plus, TrendingUp, Heart, ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, sales, insuranceTotal, fetchSales } = useStore()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchSales().then(() => setLoaded(true))
  }, [])

  const total    = sales.reduce((a, s) => a + Number(s.amount), 0)
  const net      = sales.reduce((a, s) => a + Number(s.net_amount), 0)
  const negocio  = sales.filter(s => s.category === 'negocio').reduce((a, s) => a + Number(s.amount), 0)
  const hogar    = sales.filter(s => s.category === 'hogar').reduce((a, s) => a + Number(s.amount), 0)

  const pieData = [
    { name: 'Negocio', value: negocio || 1 },
    { name: 'Hogar',   value: hogar   || 0 },
  ]

  // Meta seguro: $50.000 por mes
  const insuranceMeta = 50000
  const insurancePct  = Math.min((insuranceTotal / insuranceMeta) * 100, 100)

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'var(--verde)',
        padding: '52px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 4 }}>
          Hola, {user?.name?.split(' ')[0]} 👋
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 36,
          color: 'white',
          lineHeight: 1,
        }}>
          {fmt(net)}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 6, fontWeight: 300 }}>
          ganancia limpia · {sales.length} ventas registradas
        </p>
      </div>

      <div className="page-body">
        {/* Seguro acumulado — EL DIFERENCIADOR */}
        <div style={{
          background: 'var(--rosa)',
          borderRadius: 'var(--radio)',
          padding: '20px',
          color: 'white',
          animation: loaded ? 'fadeUp 0.4s ease' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Heart size={18} fill="white" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Tu fondo de salud</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1,
              }}>{fmt(insuranceTotal)}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                acumulado automáticamente
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              meta<br />
              <span style={{ color: 'white', fontWeight: 600 }}>{fmt(insuranceMeta)}</span>
            </div>
          </div>
          {/* Barra de progreso */}
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${insurancePct}%`,
              background: 'white',
              borderRadius: 8,
              transition: 'width 1s ease',
            }} />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>
            2.5% de cada venta va automáticamente a tu cobertura 💚
          </p>
        </div>

        {/* Negocio vs Hogar */}
        <div className="card" style={{ animation: loaded ? 'fadeUp 0.5s ease' : 'none' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gris-medio)', marginBottom: 16 }}>
            NEGOCIO VS HOGAR
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 110, height: 110, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                    dataKey="value" strokeWidth={0}>
                    <Cell fill="var(--verde)" />
                    <Cell fill="var(--rosa-bg)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--verde)' }} />
                    <span style={{ fontSize: 12, color: 'var(--gris-medio)' }}>Negocio</span>
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}>
                    {fmt(negocio)}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--rosa)' }} />
                    <span style={{ fontSize: 12, color: 'var(--gris-medio)' }}>Hogar</span>
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}>
                    {fmt(hogar)}
                  </div>
                </div>
              </div>
              {negocio > 0 && (
                <div style={{
                  background: 'var(--verde-bg)', borderRadius: 8, padding: '8px 12px',
                  fontSize: 12, color: 'var(--verde)', fontWeight: 500,
                }}>
                  {Math.round((negocio / (negocio + hogar)) * 100)}% viene de tu negocio ✨
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Últimas ventas */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gris-medio)', marginBottom: 12 }}>
            ÚLTIMAS VENTAS
          </p>
          {sales.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
              <p style={{ color: 'var(--gris-medio)', fontSize: 15 }}>
                Aún no tienes ventas registradas.<br />
                ¡Registra tu primera venta!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sales.slice(0, 5).map((s, i) => (
                <div key={s.id} className="card" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px',
                  animation: `fadeUp ${0.3 + i * 0.08}s ease`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: s.category === 'negocio' ? 'var(--verde-bg)' : 'var(--rosa-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      {s.category === 'negocio' ? '🛍️' : '🏠'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{s.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--gris-medio)' }}>
                        -{fmt(s.insurance_amount)} al seguro
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700 }}>
                      {fmt(s.amount)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--verde)', fontWeight: 500 }}>
                      neto {fmt(s.net_amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB — Nueva venta */}
      <button className="fab" onClick={() => navigate('/app/venta')}>
        <Plus size={24} />
      </button>
    </div>
  )
}
