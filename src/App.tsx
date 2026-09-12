import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import PlanillaPublica from './pages/PlanillaPublica'
import ElegirAgencia from './pages/ElegirAgencia'
import Agencia from './pages/Agencia'
import { AuthProvider } from './context/authContext'
import { RutaProtegida } from './components/RutaProtegida'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planilla/:clienteId" element={<PlanillaPublica />} />
          <Route path="/login" element={<Login />} />
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