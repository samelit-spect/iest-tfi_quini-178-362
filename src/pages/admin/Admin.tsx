import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import NavAdmin from '../../components/NavAdmin'

function Admin() {
  const { perfil, inicioPorRol } = useAuth()

  if (!perfil || perfil.rol !== 'admin') {
    return <Navigate to={inicioPorRol ?? '/'} replace />
  }

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

          <NavAdmin />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-16 sm:px-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Admin