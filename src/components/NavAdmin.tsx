import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'

const TABS = [
  { to: '/admin/dashboard', label: 'Inicio', icon: '📊' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/admin/clientes', label: 'Clientes', icon: '🧾' },
  { to: '/admin/planillas', label: 'Planillas', icon: '📋' },
]

function NavAdmin() {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const tabActivo = (to: string) => pathname.startsWith(to)

  return (
    <>
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
          onClick={() => void logout()}
          className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
        >
          Salir
        </button>
      </div>

      <div className="relative md:hidden">
        <button
          type="button"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-stone-300 bg-white text-xl font-bold text-stone-700 transition hover:border-stone-400"
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
        {menuAbierto && (
          <div className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl animate-scale-in">
            <p className="px-3 pb-1 pt-2 text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Navegación
            </p>
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-lg font-bold transition ${
                  tabActivo(t.to)
                    ? 'bg-coal-950 text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </Link>
            ))}
            <p className="mt-2 px-3 pb-1 pt-1 text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Cuenta
            </p>
            <Link
              to="/elegir-agencia"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-lg font-bold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              <span>🏢</span>
              Agencias
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-lg font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <span>🚪</span>
              Salir
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default NavAdmin