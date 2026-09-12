import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'

function ElegirAgencia() {
  const { perfil, logout, inicioPorRol } = useAuth()
  const navigate = useNavigate()

  if (!perfil || perfil.rol !== 'admin') {
    return <Navigate to={inicioPorRol ?? '/'} replace />
  }

  const agencias = [
    { numero: 178, nombre: 'El Rincón del Sur', color: 'from-brand-600 to-brand-800' },
    { numero: 362, nombre: 'La Suerte de Todos', color: 'from-brand-700 to-brand-950' },
  ]

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden px-4 py-6 sm:px-10">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl animate-float-slow" />

      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-lg font-extrabold text-white shadow-lg shadow-brand-600/30 rotate-3">
            FQ
          </div>
          <p className="text-base font-extrabold text-stone-900">Fichas de Quiniela</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
            👑 {perfil.nombre}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-stone-300 bg-white/70 px-4 py-2 text-sm font-bold text-stone-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8">
        <div className="max-w-2xl text-center animate-fade-up">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-bold tracking-wide text-brand-700 uppercase">
            Bienvenido, administrador
          </p>
          <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
            ¿En qué agencia vas a trabajar?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-lg text-stone-600">
            Elegí la agencia para ver sus planillas y confirmar movimientos.
          </p>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {agencias.map((a, i) => (
            <button
              key={a.numero}
              type="button"
              onClick={() => navigate(`/agencia/${a.numero}`)}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${a.color} p-8 text-left text-white shadow-xl shadow-brand-900/20 transition hover:-translate-y-1 hover:shadow-2xl animate-fade-up`}
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              <div className="pointer-events-none absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-white/10 blur-xl transition group-hover:scale-150" />
              <p className="text-4xl font-extrabold tabular-nums">
                Nº {a.numero}
              </p>
              <p className="mt-1 text-lg font-semibold text-white/85">{a.nombre}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition group-hover:bg-white/25">
                Entrar
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <Link to="/" className="text-base font-semibold text-stone-500 hover:text-brand-600">
          ← Ver el sitio público
        </Link>
      </main>
    </div>
  )
}

export default ElegirAgencia