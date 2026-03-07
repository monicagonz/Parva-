// src/components/Layout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, Sparkles } from 'lucide-react'

const NAV = [
  { path: '/app',            icon: LayoutDashboard, label: 'Inicio'     },
  { path: '/app/inventario', icon: Package,         label: 'Productos'  },
  { path: '/app/coach',      icon: Sparkles,        label: 'Coach IA'   },
]

export default function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <Outlet />
      <nav className="bottom-nav">
        {NAV.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            className={`nav-item ${pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
