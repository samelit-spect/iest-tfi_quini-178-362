import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ComoHicimos from './pages/ComoHicimos'
import PlanillaPublica from './pages/PlanillaPublica'
import ElegirAgencia from './pages/ElegirAgencia'
import Agencia from './pages/Agencia'
import FichaCliente from './pages/FichaCliente'
import Tirillas from './pages/Tirillas'
import Admin from './pages/admin/Admin'
import Usuarios from './pages/admin/Usuarios'
import Clientes from './pages/admin/Clientes'
import Planillas from './pages/admin/Planillas'
import Dashboard from './pages/admin/Dashboard'
import { AuthProvider } from './context/authContext'
import { RutaProtegida } from './components/RutaProtegida'
import VigilanteSesion from './components/VigilanteSesion'

function App() {
  return (
    <AuthProvider>
      <VigilanteSesion />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planilla/:clienteId" element={<PlanillaPublica />} />
          <Route path="/login" element={<Login />} />
          <Route path="/como-hicimos" element={<ComoHicimos />} />
          <Route
            path="/elegir-agencia"
            element={
              <RutaProtegida>
                <ElegirAgencia />
              </RutaProtegida>
            }
          />
          <Route
            path="/agencia/:agenciaId"
            element={
              <RutaProtegida>
                <Agencia />
              </RutaProtegida>
            }
          />
          <Route
            path="/agencia/:agenciaId/clientes/:clienteId"
            element={
              <RutaProtegida>
                <FichaCliente />
              </RutaProtegida>
            }
          />
          <Route
            path="/agencia/:agenciaId/tirillas"
            element={
              <RutaProtegida>
                <Tirillas />
              </RutaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RutaProtegida>
                <Admin />
              </RutaProtegida>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="planillas" element={<Planillas />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
                <span className="text-5xl">🗺️</span>
                <h1 className="text-2xl font-extrabold text-stone-900">Página no encontrada</h1>
                <Link to="/" className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700">
                  Volver al inicio
                </Link>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App