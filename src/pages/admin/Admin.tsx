import { useState } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth'

const TABS = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/admin/clientes', label: 'Clientes', icon: '🧾' },
  { to: '/admin/planillas', label: 'Planillas', icon: '📋' },
]

function Admin() {
  const { perfil, inicioPorRol, logout } = useAuth()
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  function cerrar() {
    setMenuAbierto(false)
  }

  function salir() {
    cerrar()
    void logout()
  }

  if (!perfil || perfil.rol !== 'admin') {
    return <Navigate to={inicioPorRol ?? '/'} replace />
  }

  const tabActivo = (to: string) => pathname.startsWith(to)

  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link to="/elegir-agencia" className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-coal-950 text-lg font-extrabold text-white shadow-lg rotate-3">
              FQ
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-base font-extrabold text-stone-900">Panel de administración</p>
              <p className="truncate text-sm font-semibold text-stone-500">Fichas de Quiniela · {perfil.nombre}</p>
            </div>
          </Link>

          <div className="hidden items-center gap-1.5 md:flex">
            <nav className="flex items-center gap-1">
              {TABS.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold transition ${
                    tabActivo(t.to)
                      ? 'bg-coal-950 text-white shadow-md shadow-stone-900/20'
                      : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </Link>
              ))}
            </nav>
            <span className="mx-1 h-6 w-px bg-stone-200" aria-hidden="true" />
            <Link
              to="/elegir-agencia"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              🏢 Agencias
            </Link>
            <button
              type="button"
              onClick={salir}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
            >
              Salir
            </button>
          </div>

          <button
            type="button"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((v) => !v)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-stone-300 bg-white text-xl font-bold text-stone-700 transition hover:border-stone-400 md:hidden"
          >
            {menuAbierto ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {menuAbierto && (
        <nav className="relative z-30 border-b border-stone-200/70 bg-white/95 px-4 pb-4 backdrop-blur animate-fade-up md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 pt-3">
            <p className="px-2 pb-1 text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Navegación
            </p>
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                onClick={cerrar}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-bold transition ${
                  tabActivo(t.to)
                    ? 'bg-coal-950 text-white shadow-md shadow-stone-900/20'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </Link>
            ))}
            <p className="mt-2 px-2 pb-1 text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Cuenta
            </p>
            <Link
              to="/elegir-agencia"
              onClick={cerrar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-bold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              <span className="text-xl">🏢</span>
              Agencias
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <span className="text-xl">🚪</span>
              Salir
            </button>
          </div>
        </nav>
      )}

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-16 sm:px-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Admin