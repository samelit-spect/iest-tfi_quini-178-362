import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import { RutaProtegida } from './components/RutaProtegida'
import VigilanteSesion from './components/VigilanteSesion'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const ComoHicimos = lazy(() => import('./pages/ComoHicimos'))
const Galeria = lazy(() => import('./pages/Galeria'))
const PlanillaPublica = lazy(() => import('./pages/PlanillaPublica'))
const ElegirAgencia = lazy(() => import('./pages/ElegirAgencia'))
const Agencia = lazy(() => import('./pages/Agencia'))
const FichaCliente = lazy(() => import('./pages/FichaCliente'))
const Tirillas = lazy(() => import('./pages/Tirillas'))
const Admin = lazy(() => import('./pages/admin/Admin'))
const Usuarios = lazy(() => import('./pages/admin/Usuarios'))
const Clientes = lazy(() => import('./pages/admin/Clientes'))
const Planillas = lazy(() => import('./pages/admin/Planillas'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))

function App() {
  return (
    <AuthProvider>
      <VigilanteSesion />
      <BrowserRouter>
        <Suspense fallback={<CargandoPagina />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planilla/:clienteId" element={<PlanillaPublica />} />
            <Route path="/login" element={<Login />} />
            <Route path="/como-hicimos" element={<ComoHicimos />} />
            <Route path="/galeria" element={<Galeria />} />
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
                  <Link
                    to="/"
                    className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700"
                  >
                    Volver al inicio
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

function CargandoPagina() {
  return (
    <div className="grid min-h-svh place-items-center bg-cream-100">
      <div className="skeleton h-14 w-72 rounded-2xl" />
    </div>
  )
}

export default App
