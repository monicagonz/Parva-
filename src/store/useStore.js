// src/store/useStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

const INSURANCE_RATE = 0.025 // 2.5%

export const useStore = create(
  persist(
    (set, get) => ({
      // ── Estado ──
      user: null,         // { id, name, phone, business_name }
      sales: [],
      inventory: [],
      insuranceTotal: 0,

      // ── Auth ──
      register: async ({ name, phone, business_name }) => {
        // Buscar si ya existe
        let { data: existing } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone)
          .single()

        if (existing) {
          set({ user: existing })
          return existing
        }

        const { data, error } = await supabase
          .from('users')
          .insert({ name, phone, business_name })
          .select()
          .single()

        if (error) throw error
        set({ user: data })
        return data
      },

      login: async (phone) => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone)
          .single()

        if (error || !data) throw new Error('Número no encontrado')
        set({ user: data })
        return data
      },

      logout: () => set({ user: null, sales: [], insuranceTotal: 0 }),

      // ── Ventas ──
      addSale: async ({ amount, description, category }) => {
        const { user } = get()
        if (!user) throw new Error('No hay usuaria activa')

        const insurance = parseFloat((amount * INSURANCE_RATE).toFixed(0))
        const net = amount - insurance

        const { data, error } = await supabase
          .from('sales')
          .insert({
            user_id: user.id,
            amount,
            description,
            category,
            insurance_amount: insurance,
            net_amount: net,
          })
          .select()
          .single()

        if (error) throw error

        // Actualizar fondo seguro
        const newTotal = get().insuranceTotal + insurance
        await supabase
          .from('insurance_fund')
          .upsert({ user_id: user.id, total: newTotal })

        set((s) => ({
          sales: [data, ...s.sales],
          insuranceTotal: newTotal,
        }))

        return { sale: data, insurance, net }
      },

      fetchSales: async () => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase
          .from('sales')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        const { data: fund } = await supabase
          .from('insurance_fund')
          .select('total')
          .eq('user_id', user.id)
          .single()

        set({
          sales: data || [],
          insuranceTotal: fund?.total || 0,
        })
      },

      // ── Inventario ──
      fetchInventory: async () => {
        const { user } = get()
        if (!user) return

        const { data } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        set({ inventory: data || [] })
      },

      addProduct: async ({ name, price, stock, emoji }) => {
        const { user } = get()
        const { data, error } = await supabase
          .from('inventory')
          .insert({ user_id: user.id, name, price, stock, emoji })
          .select()
          .single()

        if (error) throw error
        set((s) => ({ inventory: [data, ...s.inventory] }))
        return data
      },

      // ── Summary para la IA ──
      getSummary: () => {
        const { sales, insuranceTotal } = get()
        const total = sales.reduce((a, s) => a + Number(s.amount), 0)
        const net = sales.reduce((a, s) => a + Number(s.net_amount), 0)
        const negocio = sales
          .filter((s) => s.category === 'negocio')
          .reduce((a, s) => a + Number(s.amount), 0)
        const hogar = sales
          .filter((s) => s.category === 'hogar')
          .reduce((a, s) => a + Number(s.amount), 0)
        return { total, net, insurance: insuranceTotal, negocio, hogar, count: sales.length }
      },
    }),
    { name: 'parva-store', partialize: (s) => ({ user: s.user }) }
  )
)
