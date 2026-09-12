import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'

function ElegirAgencia() {
  const { perfil, logout, inicioPorRol } = useAuth()
  const navigate = useNavigate()

  if (!perfil || perfil.rol !== 'admin') {
    return <Navigate to={inicioPorRol ?? '/'} replace />
  }

  const agencias = [
    {
      numero: 178,
      nombre: 'El Rincón del Sur',
      gradiente: 'from-emerald-600 via-emerald-700 to-coal-950',
      enfasis: 'text-emerald-100',
    },
    {
      numero: 362,
      nombre: 'La Suerte de Todos',
      gradiente: 'from-sky-600 via-sky-700 to-coal-950',
      enfasis: 'text-sky-100',
    },
  ]

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden px-4 py-6 sm:px-10">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl animate-float-slow" />

      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-coal-950 text-lg font-extrabold text-white shadow-lg rotate-3">
            FQ
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">Fichas de Quiniela</p>
            <p className="text-sm font-semibold text-stone-500">Panel del administrador</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
            👑 {perfil.nombre}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-stone-300 bg-white/70 px-4 py-2 text-sm font-bold text-stone-700 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8">
        <div className="max-w-2xl text-center animate-fade-up">
          <h1 className="text-3xl leading-tight font-extrabold text-stone-900 sm:text-4xl">
            ¿En qué agencia vas a <span className="text-emerald-600">trabajar hoy?</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-stone-600">
            Elegí la agencia y entrá a sus planillas y confirmaciones.
          </p>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {agencias.map((a, i) => (
            <button
              key={a.numero}
              type="button"
              onClick={() => navigate(`/agencia/${a.numero}`)}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${a.gradiente} p-8 pt-10 text-left text-white shadow-xl shadow-stone-900/20 transition hover:-translate-y-1 hover:shadow-2xl animate-fade-up sm:p-10 sm:pt-14`}
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              <div className="pointer-events-none absolute -right-8 -bottom-10 h-36 w-36 rounded-full bg-white/10 blur-2xl transition group-hover:scale-150" />
              <p className={`text-sm font-bold tracking-widest uppercase ${a.enfasis} opacity-90`}>
                Agencia de quiniela
              </p>
              <p className="mt-1 text-5xl font-extrabold tabular-nums sm:text-6xl">
                Nº {a.numero}
              </p>
              <p className="mt-2 text-xl font-semibold text-white/90">{a.nombre}</p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-base font-bold backdrop-blur transition group-hover:bg-white/25">
                Entrar
                <svg className="h-5 w-5 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '280ms' }}>
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-4 text-base font-bold text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-md"
          >
            🛠️ Panel de administración
            <span className="rounded-full bg-coal-950 px-2 py-0.5 text-xs font-extrabold text-white uppercase">
              usuarios · confirmaciones
            </span>
          </Link>
          <Link to="/" className="text-base font-semibold text-stone-500 hover:text-stone-700">
            ← Ver el sitio público
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ElegirAgencia