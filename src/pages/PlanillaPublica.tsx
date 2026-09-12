import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Cliente, Movimiento } from '../types'
import { leerCliente } from '../services/clientesService'
import { leerAgencia, leerMovimientosConfirmados } from '../services/movimientosService'
import { formatoFecha, formatoPesos } from '../utils/format'
import { useCountUp } from '../hooks/useCountUp'

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'ok'; cliente: Cliente; movimientos: Movimiento[]; agencia: { numero: number; nombre: string } | null }

function PlanillaPublica() {
  const { clienteId } = useParams()
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })

  useEffect(() => {
    let activo = true
    async function cargar() {
      if (!clienteId) return
      try {
        const cliente = await leerCliente(clienteId)
        if (!cliente) {
          if (activo) setCarga({ estado: 'error' })
          return
        }
        const [movimientos, agencia] = await Promise.all([
          leerMovimientosConfirmados(cliente.id),
          leerAgencia(cliente.agenciaId),
        ])
        if (activo) setCarga({ estado: 'ok', cliente, movimientos, agencia })
      } catch {
        if (activo) setCarga({ estado: 'error' })
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [clienteId])

  if (carga.estado === 'cargando') return <Esqueleto />

  if (carga.estado === 'error') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🧾</span>
        <h1 className="text-2xl font-extrabold text-stone-900">
          Planilla no encontrada
        </h1>
        <p className="max-w-sm text-base text-stone-600">
          No encontramos esa planilla. Verificá el nombre o la dirección de la
          consulta.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-700"
        >
          Volver a buscar
        </Link>
      </div>
    )
  }

  return <Contenido cliente={carga.cliente} movimientos={carga.movimientos} agencia={carga.agencia} />
}

function Contenido({
  cliente,
  movimientos,
  agencia,
}: {
  cliente: Cliente
  movimientos: Movimiento[]
  agencia: { numero: number; nombre: string } | null
}) {
  const totalCredito = useMemo(
    () => movimientos.filter((m) => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0),
    [movimientos],
  )
  const totalDebito = useMemo(
    () => movimientos.filter((m) => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0),
    [movimientos],
  )
  const saldo = totalCredito - totalDebito
  const saldoAnimado = useCountUp(saldo)

  return (
    <div className="min-h-svh pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 px-5 pt-6 pb-24 text-white sm:px-10">
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur transition hover:bg-white/20"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-2xl font-extrabold uppercase backdrop-blur ring-1 ring-white/20">
                {cliente.nombre[0]}
                {cliente.apellido[0]}
              </span>
              <div>
                <p className="text-sm font-bold tracking-widest text-white/80 uppercase">
                  {agencia
                    ? `Agencia ${agencia.numero} · ${agencia.nombre}`
                    : `Agencia ${cliente.agenciaId}`}
                </p>
                <h1 className="mt-0.5 text-3xl font-extrabold sm:text-4xl">
                  {cliente.apellido} {cliente.nombre}
                </h1>
                <p className="text-base font-semibold text-white/80">
                  Planilla de créditos y débitos
                </p>
              </div>
            </div>

            <div className="min-w-48 rounded-2xl bg-white/10 px-5 py-4 text-right backdrop-blur ring-1 ring-white/15">
              <p className="text-sm font-bold tracking-wider text-white/80 uppercase">Saldo actual</p>
              <p
                className={`text-3xl font-extrabold tabular-nums ${
                  saldo >= 0 ? 'text-emerald-200' : 'text-amber-300'
                }`}
              >
                {formatoPesos.format(Math.round(saldoAnimado))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3.5 backdrop-blur ring-1 ring-white/15 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <p className="text-sm font-bold tracking-wider text-white/80 uppercase">Créditos</p>
              <p className="text-xl font-extrabold text-emerald-200 tabular-nums">
                +{formatoPesos.format(totalCredito)}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3.5 backdrop-blur ring-1 ring-white/15 animate-fade-up" style={{ animationDelay: '180ms' }}>
              <p className="text-sm font-bold tracking-wider text-white/80 uppercase">Débitos</p>
              <p className="text-xl font-extrabold text-amber-300 tabular-nums">
                −{formatoPesos.format(totalDebito)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl px-5 sm:px-10">
        {movimientos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center animate-fade-up">
            <span className="text-5xl">🗂️</span>
            <p className="text-lg font-extrabold text-stone-800">Sin movimientos aún</p>
            <p className="max-w-xs text-base text-stone-600">
              Cuando la agencia confirme movimientos, aparecerán acá con su
              fecha, descripción y monto.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-stone-900/5 ring-1 ring-stone-100 animate-fade-up">
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <p className="text-base font-extrabold text-stone-800">
                Movimientos confirmados
              </p>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
                {movimientos.length} {movimientos.length === 1 ? 'registrado' : 'registrados'}
              </span>
            </div>

            <ul className="divide-y divide-stone-100">
              {movimientos.map((m, i) => (
                <li
                  key={m.id}
                  className="group flex items-center gap-4 px-6 py-4 transition hover:bg-brand-50/60 animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 45, 500)}ms` }}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white transition group-hover:scale-110">
                    {m.tipo === 'credito' ? (
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 shadow-md shadow-emerald-500/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                        </svg>
                      </span>
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 shadow-md shadow-brand-500/30">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l7-7m-7 7l-7-7" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-stone-800">
                      {m.descripcion}
                    </p>
                    <p className="text-sm font-semibold text-stone-500">
                      {formatoFecha(m.fecha)} · Confirmado por la agencia
                    </p>
                  </div>

                  <p
                    className={`shrink-0 text-lg font-extrabold tabular-nums ${
                      m.tipo === 'credito' ? 'text-emerald-600' : 'text-brand-600'
                    }`}
                  >
                    {m.tipo === 'credito' ? '+' : '−'}
                    {formatoPesos.format(m.monto)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between bg-cream-100 px-6 py-4">
              <p className="text-base font-extrabold text-stone-700">Total de la planilla</p>
              <p
                className={`text-xl font-extrabold tabular-nums ${
                  totalCredito - totalDebito >= 0 ? 'text-emerald-600' : 'text-brand-600'
                }`}
              >
                {formatoPesos.format(totalCredito - totalDebito)}
              </p>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-stone-500 animate-fade-up">
          Fichas de Quiniela · Agencias 178 y 362 · Los movimientos confirmados
          no pueden modificarse.
        </p>
      </div>
    </div>
  )
}

function Esqueleto() {
  return (
    <div className="min-h-svh pb-16">
      <div className="bg-gradient-to-br from-brand-600 to-brand-950 px-5 pt-6 pb-24 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-24 rounded-full" />
              <div className="skeleton h-6 w-44 rounded-full" />
            </div>
          </div>
          <div className="skeleton h-20 w-44 rounded-2xl" />
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-3xl space-y-3 px-5 sm:px-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-16 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}

export default PlanillaPublica