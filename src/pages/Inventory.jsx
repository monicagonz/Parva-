// src/pages/Inventory.jsx
import { useEffect, useState } from 'react'
import { Plus, Package } from 'lucide-react'
import { useStore } from '../store/useStore'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`

const EMOJIS = ['👗','👠','💄','🧴','💍','👜','🌸','🎀','🧁','🍱','🌿','📦']

export default function Inventory() {
  const { inventory, fetchInventory, addProduct } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', stock: '', emoji: '📦' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchInventory() }, [])

  const handleAdd = async () => {
    if (!form.name || !form.price) return
    setLoading(true)
    try {
      await addProduct({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        emoji: form.emoji,
      })
      setForm({ name: '', price: '', stock: '', emoji: '📦' })
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mis productos</h1>
        <p>{inventory.length} productos registrados</p>
      </div>

      <div className="page-body">
        {inventory.length === 0 && !showForm && (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p style={{ color: 'var(--gris-medio)', fontSize: 15, marginBottom: 20 }}>
              Aún no tienes productos.<br />Agrega el primero.
            </p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Agregar producto
            </button>
          </div>
        )}

        {showForm && (
          <div className="card" style={{ border: '2px solid var(--verde)' }}>
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Nuevo producto</p>

            {/* Selector de emoji */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                  style={{
                    width: 36, height: 36, borderRadius: 8, fontSize: 18,
                    background: form.emoji === e ? 'var(--verde-bg)' : 'var(--gris)',
                    border: form.emoji === e ? '2px solid var(--verde)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}>{e}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input-field" placeholder="Nombre del producto"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className="input-field" placeholder="Precio de venta" type="number"
                value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              <input className="input-field" placeholder="Unidades en stock" type="number"
                value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn-primary" onClick={handleAdd} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {inventory.map((item, i) => (
          <div key={item.id} className="card"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              animation: `fadeUp ${0.2 + i * 0.06}s ease`,
            }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--crema)', fontSize: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: 'var(--gris-medio)', marginTop: 2 }}>
                {item.stock} unidades en stock
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18, fontWeight: 700, color: 'var(--verde)',
              }}>{fmt(item.price)}</div>
              {item.stock <= 3 && item.stock > 0 && (
                <div style={{
                  fontSize: 11, color: 'var(--rosa)', fontWeight: 600, marginTop: 2,
                }}>⚠️ Poco stock</div>
              )}
              {item.stock === 0 && (
                <div style={{
                  fontSize: 11, color: 'var(--rosa)', fontWeight: 600, marginTop: 2,
                }}>❌ Agotado</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!showForm && inventory.length > 0 && (
        <button className="fab" onClick={() => setShowForm(true)}>
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}
