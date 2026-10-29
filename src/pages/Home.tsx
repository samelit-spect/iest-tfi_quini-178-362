import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Cliente } from '../types'
import { buscarClientes } from '../services/clientesService'
import { normalizar } from '../utils/normalizar'
import { useAuth } from '../context/auth'
import { PiePublico } from '../components/PiePublico'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle('Quini 178/362 · Tu planilla de la agencia, sin papel')
  const { estado, inicioPorRol } = useAuth()
  const [termino, setTermino] = useState('')
  const [sugerencias, setSugerencias] = useState<Cliente[] | null>(null)
  const [cargando, setCargando] = useState(false)
  const [filtro, setFiltro] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = window.setTimeout(async () => {
      const t = normalizar(termino)
      setFiltro(t)
      if (t.length < 2) {
        setSugerencias(null)
        setCargando(false)
        return
      }
      setCargando(true)
      try {
        const res = await buscarClientes(t)
        setSugerencias(res)
      } finally {
        setCargando(false)
      }
    }, 250)
    return () => window.clearTimeout(token)
  }, [termino])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSugerencias(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const entrar = (id: string) => {
    setSugerencias(null)
    navigate(`/planilla/${id}`)
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl animate-float-slow" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <img
            src="/marca/isotipo-quini.svg"
            alt="Isotipo de Quini 178/362"
            className="h-10 w-10 rounded-xl shadow-lg shadow-brand-600/30 animate-scale-in"
          />
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">Quini 178/362</p>
            <p className="text-sm font-semibold text-stone-500">Fichas digitalizadas</p>
          </div>
        </div>
        {estado === 'logueado' && inicioPorRol ? (
          <Link
            to={inicioPorRol}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-base font-bold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Entrar al panel
          </Link>
        ) : (
          <Link
            to="/login"
            className="rounded-xl border border-stone-300 bg-white/70 px-5 py-2.5 text-base font-bold text-stone-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600 hover:shadow-md"
          >
            Iniciar sesión
          </Link>
        )}
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-16 text-center">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-bold tracking-wide text-brand-700 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
            Consulta tu planilla en línea
          </p>
          <h1 className="text-4xl leading-tight font-extrabold text-stone-900 sm:text-6xl">
            Tus créditos y débitos,
            <span className="text-brand-600"> al día</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-stone-600">
            Buscá por apellido y nombre sin registrarte. Solo lectura: tus
            movimientos confirmados por la agencia, siempre disponibles.
          </p>
        </div>

        <div
          ref={ref}
          className="w-full max-w-lg animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          <div className="relative">
            <svg
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
            <input
              autoComplete="off"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onFocus={() => {
                if (normalizar(termino).length >= 2) setSugerencias([])
              }}
              placeholder="Apellido y nombre de un cliente…"
              className="w-full rounded-2xl border border-stone-300 bg-white py-4 pr-16 pl-12 text-lg shadow-xl shadow-stone-900/5 outline-none transition focus:scale-[1.01] focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {cargando && (
              <div className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            )}
          </div>

          {filtro.length >= 2 && (sugerencias === null || cargando) && !cargando && (
            <div className="mt-2 rounded-xl bg-white p-4 text-base text-stone-600 shadow-lg">
              Escribí para ver resultados…
            </div>
          )}

          {sugerencias !== null && (
            <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-xl shadow-stone-900/10 ring-1 ring-stone-100 animate-scale-in">
              {sugerencias.length === 0 ? (
                <div className="flex items-center gap-3 px-5 py-4 text-left">
                  <span className="text-2xl">🧾</span>
                  <div>
                    <p className="text-base font-bold text-stone-700">
                      No encontramos "{filtro}"
                    </p>
                    <p className="text-sm text-stone-500">
                      Verificá que el nombre esté bien escrito.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="max-h-80 overflow-auto">
                  {sugerencias.map((c, i) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => entrar(c.id)}
                        className="group flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition hover:bg-brand-50"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-base font-extrabold text-white uppercase">
                            {c.nombre[0]}
                            {c.apellido[0]}
                          </span>
                          <div className="leading-tight">
                            <p className="text-base font-bold text-stone-800 group-hover:text-brand-700">
                              {c.apellido}{' '}
                              <span className="font-semibold text-stone-600">{c.nombre}</span>
                            </p>
                            <p className="text-sm font-semibold text-stone-500">
                              Agencia {c.agenciaId}
                            </p>
                          </div>
                        </div>
                        <svg
                          className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-stone-500 animate-fade-up" style={{ animationDelay: '240ms' }}>
          {['✔ Sin registrarte', '✔ Historial completo', '✔ Saldo al día'].map((t) => (
            <span
              key={t}
              className="rounded-full border border-stone-200 bg-white/60 px-3 py-1.5 backdrop-blur transition hover:border-brand-200 hover:text-brand-600"
            >
              {t}
            </span>
          ))}
        </div>
      </main>

      <PiePublico />
    </div>
  )
}

export default Home