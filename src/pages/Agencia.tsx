import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { leerAgencia } from '../services/movimientosService'

type Carga = { estado: 'cargando' } | { estado: 'error' } | { estado: 'ok'; numero: number; nombre: string }

function Agencia() {
  const { agenciaId } = useParams()
  const { perfil, logout } = useAuth()
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })

  const numero = Number(agenciaId)

  useEffect(() => {
    let activo = true
    if (!agenciaId) return
    leerAgencia(agenciaId)
      .then((a) => {
        if (activo) setCarga(a ? { estado: 'ok', numero: a.numero, nombre: a.nombre } : { estado: 'error' })
      })
      .catch(() => {
        if (activo) setCarga({ estado: 'error' })
      })
    return () => {
      activo = false
    }
  }, [agenciaId])

  const permitido =
    perfil &&
    (perfil.rol === 'admin' || (perfil.rol === 'empleado' && perfil.agenciaId === agenciaId))

  if (numero !== 178 && numero !== 362) {
    return <NoEncontrada />
  }

  if (!permitido) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🚫</span>
        <h1 className="text-2xl font-extrabold text-stone-900">Sin acceso a esta agencia</h1>
        <p className="max-w-sm text-base text-stone-600">
          Tu usuario no está asignado a la agencia {agenciaId}.
        </p>
        <Link to="/" className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-float" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-lg font-extrabold text-white shadow-lg shadow-brand-600/30 rotate-3">
            FQ
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">Fichas de Quiniela</p>
            <p className="text-sm font-semibold text-stone-500">
              Agencia {agenciaId} {carga.estado === 'ok' ? `· ${carga.nombre}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 sm:inline">
            {perfil?.rol === 'admin' ? '👑' : '🧾'} {perfil?.nombre}
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

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-16 text-center">
        {carga.estado === 'cargando' ? (
          <div className="skeleton h-24 w-full max-w-xl rounded-3xl" />
        ) : (
          <div className="max-w-xl animate-fade-up">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-bold tracking-wide text-brand-700 uppercase">
              {perfil?.rol === 'admin' ? 'Administración' : 'Tu agencia'}
            </p>
            <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
              Agencia <span className="text-brand-600">{agenciaId}</span>
            </h1>
            {carga.estado === 'ok' && (
              <p className="mt-1 text-lg font-semibold text-stone-600">{carga.nombre}</p>
            )}
            <p className="mx-auto mt-4 max-w-lg text-lg text-stone-600">
              Acá vas a gestionar las planillas de los clientes de esta agencia.
            </p>
          </div>
        )}

        <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white/70 p-6 text-left backdrop-blur">
            <span className="text-3xl">📋</span>
            <p className="mt-3 text-lg font-extrabold text-stone-800">Planillas de clientes</p>
            <p className="mt-1 text-base text-stone-500">
              Buscar clientes, sumar o restar créditos y débitos. Próximamente.
            </p>
          </div>
          {perfil?.rol === 'admin' && (
            <Link
              to="/admin"
              className="group rounded-3xl border-2 border-stone-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <span className="text-3xl">🛠️</span>
              <p className="mt-3 text-lg font-extrabold text-stone-800">Panel de administración</p>
              <p className="mt-1 text-base text-stone-500">
                Crear usuarios y confirmar movimientos.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-stone-600 transition group-hover:text-stone-900">
                Abrir panel
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          )}
        </div>

        <Link to="/" className="text-base font-semibold text-stone-500 hover:text-brand-600">
          ← Ver el sitio público
        </Link>
      </main>
    </div>
  )
}

function NoEncontrada() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-5xl">🔍</span>
      <h1 className="text-2xl font-extrabold text-stone-900">Agencia no encontrada</h1>
      <Link to="/" className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700">
        Volver al inicio
      </Link>
    </div>
  )
}

export default Agencia