import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth'

const TABS = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/admin/clientes', label: 'Clientes', icon: '🧾' },
  { to: '/admin/confirmaciones', label: 'Confirmaciones', icon: '✅' },
]

function Admin() {
  const { perfil, inicioPorRol, logout } = useAuth()
  const { pathname } = useLocation()

  if (!perfil || perfil.rol !== 'admin') {
    return <Navigate to={inicioPorRol ?? '/'} replace />
  }

  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 bg-white/70 px-5 py-4 backdrop-blur sm:px-10">
        <Link to="/elegir-agencia" className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-coal-950 text-lg font-extrabold text-white shadow-lg rotate-3">
            FQ
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">Panel de administración</p>
            <p className="text-sm font-semibold text-stone-500">Fichas de Quiniela · {perfil.nombre}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/elegir-agencia"
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-brand-300 hover:text-brand-600"
          >
            Agencias
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
          >
            Salir
          </button>
        </div>
      </header>

      <nav className="relative z-10 flex max-w-2xl gap-2 px-5 pt-5 sm:px-10">
        {TABS.map((t) => {
          const activo = pathname.startsWith(t.to)
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex items-center gap-2 rounded-t-xl px-5 py-3 text-base font-bold transition ${
                activo
                  ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200'
                  : 'text-stone-500 hover:bg-white/60 hover:text-stone-800'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </Link>
          )
        })}
      </nav>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-16 sm:px-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Admin