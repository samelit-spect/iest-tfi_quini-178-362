import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { leerAgencia } from '../services/movimientosService'
import { listarClientesPorAgencia } from '../services/clientesService'
import { normalizar } from '../utils/normalizar'
import type { Cliente } from '../types'

type Carga = { estado: 'cargando' } | { estado: 'error' } | { estado: 'ok'; numero: number; nombre: string }

function Agencia() {
  const { agenciaId } = useParams()
  const { perfil, logout } = useAuth()
  const navigate = useNavigate()
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })
  const [clientes, setClientes] = useState<Cliente[] | null>(null)
  const [termino, setTermino] = useState('')

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

  useEffect(() => {
    let activo = true
    if (!agenciaId) return
    listarClientesPorAgencia(agenciaId)
      .then((c) => {
        if (activo) setClientes(c)
      })
      .catch(() => {
        if (activo) setClientes([])
      })
    return () => {
      activo = false
    }
  }, [agenciaId])

  const permitido =
    perfil &&
    (perfil.rol === 'admin' || (perfil.rol === 'empleado' && perfil.agenciaId === agenciaId))

  const filtrados = useMemo(() => {
    if (clientes === null) return null
    const t = normalizar(termino)
    if (t.length === 0) return clientes
    return clientes.filter((c) => `${normalizar(c.apellido)} ${normalizar(c.nombre)}`.includes(t))
  }, [clientes, termino])

  if (carga.estado === 'error') return <NoEncontrada />

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

  const entrarFicha = (clienteId: string) => navigate(`/agencia/${agenciaId}/clientes/${clienteId}`)

  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl animate-float" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 bg-white/70 px-5 py-4 backdrop-blur sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-coal-950 text-lg font-extrabold text-white shadow-lg rotate-3">
            FQ
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">
              Agencia {agenciaId} {carga.estado === 'ok' && `· ${carga.nombre}`}
            </p>
            <p className="text-sm font-semibold text-stone-500">
              {perfil?.rol === 'admin' ? 'Administración · visto por el dueño' : 'Tu agencia de trabajo'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {perfil?.rol === 'admin' && (
            <Link
              to="/admin"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
            >
              🛠️ Panel admin
            </Link>
          )}
          <span className="hidden rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800 sm:inline">
            {perfil?.rol === 'admin' ? '👑' : '🧾'} {perfil?.nombre}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-rose-300 hover:text-rose-600"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-10">
        <div className="text-center animate-fade-up">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold tracking-wide text-emerald-700 uppercase">
            Planillas de la agencia
          </p>
          <h1 className="text-3xl font-extrabold text-stone-900">
            ¿A qué cliente le llevás la cuenta?
          </h1>
          <p className="mx-auto mt-2 max-w-md text-lg text-stone-600">
            Buscá por apellido y nombre para abrir su planilla.
          </p>
        </div>

        <div className="relative mt-6 animate-fade-up" style={{ animationDelay: '90ms' }}>
          <svg
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            autoComplete="off"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Ej: pérez juan…"
            className="w-full rounded-2xl border border-stone-300 bg-white py-4 pr-4 pl-12 text-lg shadow-xl shadow-stone-900/5 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {filtrados === null ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-stone-300 bg-white px-6 py-12 text-center animate-fade-up">
            <span className="text-5xl">🗂️</span>
            <p className="text-lg font-extrabold text-stone-800">
              {termino ? 'Nadie con ese nombre' : 'Todavía no hay clientes'}
            </p>
            <p className="max-w-sm text-base text-stone-500">
              {termino
                ? 'Probá con otra búsqueda. Los clientes se cargan desde la base de datos.'
                : 'Cuando el dueño cargue clientes en esta agencia, van a aparecer acá.'}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-5 text-center text-sm font-bold text-stone-500">
              {filtrados.length} {filtrados.length === 1 ? 'cliente' : 'clientes'} en la agencia {agenciaId}
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up">
              {filtrados.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => entrarFicha(c.id)}
                    className="group flex h-full w-full items-center justify-between gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-stone-100 transition hover:-translate-y-0.5 hover:shadow-md animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-base font-extrabold text-white uppercase">
                        {c.apellido[0]}
                        {c.nombre[0]}
                      </span>
                      <div className="leading-tight">
                        <p className="text-lg font-extrabold text-stone-800 group-hover:text-emerald-700">
                          {c.apellido} <span className="font-semibold text-stone-500">{c.nombre}</span>
                        </p>
                        <p className="text-sm font-semibold text-stone-500">Planilla de créditos y débitos</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      Abrir planilla
                      <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
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