// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import NewSale from './pages/NewSale'
import Inventory from './pages/Inventory'
import AICoach from './pages/AICoach'
import Layout from './components/Layout'
import Inventory from './pages/Inventory'
import QRCobro from './pages/QRCobro'


function PrivateRoute({ children }) {
  const user = useStore((s) => s.user)
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="venta" element={<NewSale />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="coach" element={<AICoach />} />
          <Route path="qr" element={<QRCobro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
