import { Fragment, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { leerCliente } from '../services/clientesService'
import {
  actualizarMovimientoPendiente,
  confirmarMovimiento,
  crearMovimientoPendiente,
  eliminarMovimientoPendiente,
  leerAgencia,
  leerMovimientosConfirmados,
  listarPendientesPorCliente,
  rechazarMovimiento,
} from '../services/movimientosService'
import { formatoFecha, formatoPesos } from '../utils/format'
import { useCountUp } from '../hooks/useCountUp'
import type { Cliente, Movimiento, TipoMovimiento } from '../types'

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | {
      estado: 'ok'
      cliente: Cliente
      agencia: { numero: number; nombre: string } | null
      confirmados: Movimiento[]
      pendientes: Movimiento[]
    }

function aYmd(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function hoyYmd() {
  return aYmd(new Date().toISOString())
}

function FichaCliente() {
  const { agenciaId, clienteId } = useParams()
  const { perfil, logout } = useAuth()
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })
  const [editando, setEditando] = useState<Movimiento | null>(null)

  useEffect(() => {
    let activo = true
    if (!clienteId || !agenciaId) return
    void Promise.all([
      leerCliente(clienteId),
      leerAgencia(agenciaId),
      leerMovimientosConfirmados(clienteId),
      listarPendientesPorCliente(clienteId),
    ])
      .then(([c, a, confirmados, pendientes]) => {
        if (!activo) return
        if (!c) return setCarga({ estado: 'error' })
        setCarga({ estado: 'ok', cliente: c, agencia: a, confirmados, pendientes })
      })
      .catch(() => {
        if (activo) setCarga({ estado: 'error' })
      })
    return () => {
      activo = false
    }
  }, [clienteId, agenciaId])

  const confirmados = carga.estado === 'ok' ? carga.confirmados : []
  const pendientes = carga.estado === 'ok' ? carga.pendientes : []

  const totalCredito = useMemo(() => {
    if (carga.estado !== 'ok') return 0
    return carga.confirmados.filter((m) => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0)
  }, [carga])
  const totalDebito = useMemo(() => {
    if (carga.estado !== 'ok') return 0
    return carga.confirmados.filter((m) => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0)
  }, [carga])
  const saldo = totalCredito - totalDebito
  const saldoAnimado = useCountUp(saldo)

  const permitido =
    perfil && (perfil.rol === 'admin' || (perfil.rol === 'empleado' && perfil.agenciaId === agenciaId))

  if (carga.estado === 'cargando') return <Esqueleto />

  if (carga.estado === 'error') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🗂️</span>
        <h1 className="text-2xl font-extrabold text-stone-900">Cliente no encontrado</h1>
        <Link to={`/agencia/${agenciaId}`} className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700">
          Volver a las planillas
        </Link>
      </div>
    )
  }

  if (!permitido) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🚫</span>
        <h1 className="text-2xl font-extrabold text-stone-900">Sin acceso a esta agencia</h1>
        <Link to="/" className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const recargar = async () => {
    if (!clienteId || !agenciaId) return
    const [c, a, conf, pend] = await Promise.all([
      leerCliente(clienteId),
      leerAgencia(agenciaId),
      leerMovimientosConfirmados(clienteId),
      listarPendientesPorCliente(clienteId),
    ])
    if (!c) return
    setCarga({ estado: 'ok', cliente: c, agencia: a, confirmados: conf, pendientes: pend })
    setEditando(null)
  }

  return (
    <div className="min-h-svh pb-16">
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 bg-white/70 px-5 py-4 backdrop-blur sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-coal-950 text-lg font-extrabold text-white shadow-lg rotate-3">
            FQ
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">
              Agencia {carga.agencia?.numero ?? agenciaId} · Planilla
            </p>
            <p className="text-sm font-semibold text-stone-500">
              {perfil?.rol === 'admin'
                ? 'Sumás, restás y confirmás en la misma vista'
                : 'Sumás y restás · queda en pendiente'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      <main className="mx-auto w-full max-w-3xl px-5 sm:px-10">
        <Link
          to={`/agencia/${agenciaId}`}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
        >
          ← Volver a las planillas
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-coal-950 p-6 text-white shadow-xl shadow-emerald-900/20 animate-fade-up">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-2xl font-extrabold uppercase backdrop-blur ring-1 ring-white/20">
              {carga.cliente.nombre[0]}
              {carga.cliente.apellido[0]}
            </span>
            <div>
              <p className="text-sm font-bold tracking-widest text-emerald-100 uppercase">
                Agencia {carga.agencia?.numero ?? carga.cliente.agenciaId}
              </p>
              <h1 className="mt-0.5 text-3xl font-extrabold">
                {carga.cliente.apellido} {carga.cliente.nombre}
              </h1>
            </div>
          </div>
          <div className="min-w-52 rounded-2xl bg-white/10 px-5 py-4 text-right backdrop-blur ring-1 ring-white/15">
            <p className="text-sm font-bold tracking-wider text-emerald-100 uppercase">Saldo actual</p>
            <p className={`text-3xl font-extrabold tabular-nums ${saldo >= 0 ? 'text-emerald-100' : 'text-amber-200'}`}>
              {formatoPesos.format(Math.round(saldoAnimado))}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            Créditos {formatoPesos.format(totalCredito)}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
            Débitos {formatoPesos.format(totalDebito)}
          </span>
        </div>

        <FormMovimiento
          key={editando ? editando.id : 'nuevo'}
          movimiento={editando}
          clienteId={clienteId}
          agenciaId={agenciaId}
          perfilUid={perfil?.uid ?? ''}
          perfilNombre={perfil?.nombre ?? ''}
          onCancelar={() => setEditando(null)}
          onCambio={recargar}
        />

        {perfil?.rol === 'admin' ? (
          <TablaPlanillaAdmin
            key={clienteId}
            confirmados={confirmados}
            pendientes={pendientes}
            perfilUid={perfil?.uid ?? ''}
            perfilNombre={perfil?.nombre ?? ''}
            onEditar={(m) => {
              setEditando(m)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onCambio={recargar}
          />
        ) : (
          <>
            <ListaPendientes
              pendientes={pendientes}
              perfilUid={perfil?.uid ?? ''}
              onEditar={(m) => {
                setEditando(m)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onCambio={recargar}
            />
            <ListaConfirmados confirmados={confirmados} />
          </>
        )}
      </main>
    </div>
  )
}

function FormMovimiento({
  movimiento,
  clienteId,
  agenciaId,
  perfilUid,
  perfilNombre,
  onCancelar,
  onCambio,
}: {
  movimiento: Movimiento | null
  clienteId?: string
  agenciaId?: string
  perfilUid: string
  perfilNombre: string
  onCancelar: () => void
  onCambio: () => Promise<void>
}) {
  const [tipo, setTipo] = useState<TipoMovimiento>(movimiento?.tipo ?? 'credito')
  const [monto, setMonto] = useState(movimiento ? String(movimiento.monto) : '')
  const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? '')
  const [fecha, setFecha] = useState(movimiento ? aYmd(movimiento.fecha) : hoyYmd())
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (enviando || !clienteId || !agenciaId) return
    const montoNum = Number(monto)
    if (!descripcion.trim()) return setError('Escribí una descripción del movimiento.')
    if (!monto || !Number.isFinite(montoNum) || montoNum <= 0) return setError('El monto debe ser mayor a $0.')
    if (!fecha) return setError('Elegí la fecha del movimiento.')
    setError('')
    setMensaje(null)
    setEnviando(true)
    try {
      const datos = {
        tipo,
        monto: montoNum,
        descripcion: descripcion.trim(),
        fecha: new Date(`${fecha}T12:00:00`).toISOString(),
      }
      if (movimiento) {
        await actualizarMovimientoPendiente(movimiento.id, datos)
        setMensaje('Movimiento pendiente actualizado.')
        onCancelar()
      } else {
        await crearMovimientoPendiente({
          ...datos,
          clienteId,
          agenciaId,
          creadoPor: perfilUid,
          creadoPorNombre: perfilNombre || 'Personal',
        })
        setMensaje('Listo. Quedó en pendientes hasta que el dueño lo confirme.')
      }
      await onCambio()
    } catch {
      setError('No se pudo guardar. Intentalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl shadow-stone-900/5 ring-1 ring-stone-100 animate-fade-up sm:p-8">
      <h2 className="text-xl font-extrabold text-stone-900">
        {movimiento ? 'Corregir movimiento pendiente' : 'Sumar o restar a la cuenta'}
      </h2>
      <p className="mt-0.5 text-base text-stone-500">
        Se guarda como <strong className="text-stone-700">pendiente</strong> y espera la confirmación del dueño.
      </p>

      <form className="mt-5 flex flex-col gap-4" onSubmit={enviar}>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tipo de movimiento">
          <button
            type="button"
            onClick={() => setTipo('credito')}
            className={`rounded-2xl px-4 py-4 text-lg font-extrabold transition ${
              tipo === 'credito'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'border border-stone-300 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-700'
            }`}
          >
            ➕ Sumar
          </button>
          <button
            type="button"
            onClick={() => setTipo('debito')}
            className={`rounded-2xl px-4 py-4 text-lg font-extrabold transition ${
              tipo === 'debito'
                ? 'bg-coal-950 text-white shadow-lg shadow-stone-900/30'
                : 'border border-stone-300 bg-white text-stone-600 hover:border-stone-400'
            }`}
          >
            ➖ Restar
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="monto" className="text-sm font-bold text-stone-700">
            Monto en pesos
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg font-extrabold text-stone-400">
              $
            </span>
            <input
              id="monto"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white py-3 pr-4 pl-9 text-lg tabular-nums outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="descripcion" className="text-sm font-bold text-stone-700">
            Descripción
          </label>
          <input
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="campo"
            placeholder="Ej: Jugadas 178 - Matutina"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="fecha" className="text-sm font-bold text-stone-700">
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            max={hoyYmd()}
            onChange={(e) => setFecha(e.target.value)}
            className="campo"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-700 animate-fade-up">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-semibold text-emerald-700 animate-fade-up">
            {mensaje}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={enviando}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
          >
            {enviando
              ? 'Guardando…'
              : movimiento
                ? 'Guardar cambios'
                : tipo === 'credito'
                  ? 'Sumar a la cuenta'
                  : 'Restar de la cuenta'}
          </button>
          {movimiento && (
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-xl border border-stone-300 bg-white px-6 py-3.5 text-lg font-bold text-stone-600 transition hover:bg-stone-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function ListaPendientes({
  pendientes,
  perfilUid,
  onEditar,
  onCambio,
}: {
  pendientes: Movimiento[]
  perfilUid: string
  onEditar: (m: Movimiento) => void
  onCambio: () => Promise<void>
}) {
  const [ocupado, setOcupado] = useState<string | null>(null)

  async function borrar(m: Movimiento) {
    if (!window.confirm(`¿Borrar el pendiente "${m.descripcion}"?`)) return
    setOcupado(m.id)
    try {
      await eliminarMovimientoPendiente(m.id)
      await onCambio()
    } finally {
      setOcupado(null)
    }
  }

  if (pendientes.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border-2 border-dashed border-stone-300 bg-white px-6 py-8 text-center animate-fade-up">
        <p className="text-base font-bold text-stone-500">
          Sin movimientos pendientes en esta planilla.
        </p>
      </section>
    )
  }

  const grupos = agruparPorFecha(pendientes)

  return (
    <section className="mt-8 animate-fade-up" style={{ animationDelay: '80ms' }}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-stone-900">Pendientes por confirmar</h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
          {pendientes.length}
        </span>
      </div>
      <div className="space-y-4">
        {grupos.map(({ fecha, movimientos, neto }) => (
          <div key={fecha} className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 animate-fade-up overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-2.5">
              <p className="text-sm font-extrabold text-stone-700 uppercase tracking-wide">
                {formatoFecha(movimientos[0].fecha)}
              </p>
              <p className="text-sm font-bold tabular-nums text-stone-600">
                Subtotal: {formatoPesos.format(neto)}
              </p>
            </div>
            <ul>
              {movimientos.map((m) => {
                const mio = m.creadoPor === perfilUid
                return (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-stone-100 last:border-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white text-sm ${
                          m.tipo === 'credito' ? 'bg-emerald-500' : 'bg-stone-700'
                        }`}
                      >
                        {m.tipo === 'credito' ? '＋' : '−'}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-stone-800">{m.descripcion}</p>
                        <p className="text-xs font-semibold text-stone-500">
                          {mio ? 'Vos lo cargaste' : `Lo cargó ${m.creadoPorNombre}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-base font-extrabold tabular-nums ${m.tipo === 'credito' ? 'text-emerald-600' : 'text-stone-800'}`}
                      >
                        {m.tipo === 'credito' ? '+' : '−'}
                        {formatoPesos.format(m.monto)}
                      </p>
                      {mio && (
                        <>
                          <button
                            type="button"
                            onClick={() => onEditar(m)}
                            className="rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            disabled={ocupado === m.id}
                            onClick={() => void borrar(m)}
                            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                            title="Borrar"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

const DIAS_POR_VISTA = 5

type FilaPlanilla = {
  fecha: string
  movimientos: Movimiento[]
  creditos: number
  debitos: number
  neto: number
  saldoCorrido: number
  pendiente: boolean
}

function TablaPlanillaAdmin({
  confirmados,
  pendientes,
  perfilUid,
  perfilNombre,
  onEditar,
  onCambio,
}: {
  confirmados: Movimiento[]
  pendientes: Movimiento[]
  perfilUid: string
  perfilNombre: string
  onEditar: (m: Movimiento) => void
  onCambio: () => Promise<void>
}) {
  const [visibles, setVisibles] = useState(DIAS_POR_VISTA)
  const [ocupado, setOcupado] = useState<string | null>(null)
  const [expandido, setExpandido] = useState<string | null>(null)

  const todas = useMemo(() => {
    const grupos = agruparPorFecha([...confirmados, ...pendientes])
    return grupos.reduce<FilaPlanilla[]>((acc, g) => {
      const previo = acc.length > 0 ? acc[acc.length - 1].saldoCorrido : 0
      acc.push({
        ...g,
        saldoCorrido: previo + g.neto,
        pendiente: g.movimientos.some((m) => m.estado === 'pendiente'),
      })
      return acc
    }, [])
  }, [confirmados, pendientes])

  async function confirmarDia(fecha: string, movs: Movimiento[]) {
    if (ocupado) return
    setOcupado(fecha)
    try {
      for (const m of movs) await confirmarMovimiento(m, perfilUid, perfilNombre)
      await onCambio()
    } finally {
      setOcupado(null)
    }
  }

  async function rechazarDia(fecha: string, movs: Movimiento[]) {
    if (ocupado) return
    const n = movs.length
    if (!window.confirm(`¿Rechazar ${n} movimiento(s) de esta fecha? No se agregarán a la planilla.`)) return
    setOcupado(fecha)
    try {
      for (const m of movs) await rechazarMovimiento(m, perfilUid, perfilNombre)
      await onCambio()
    } finally {
      setOcupado(null)
    }
  }

  async function confirmarUno(m: Movimiento) {
    if (ocupado) return
    setOcupado(m.id)
    try {
      await confirmarMovimiento(m, perfilUid, perfilNombre)
      await onCambio()
    } finally {
      setOcupado(null)
    }
  }

  async function rechazarUno(m: Movimiento) {
    if (ocupado) return
    if (!window.confirm('¿Rechazar este movimiento? No se agregará a la planilla.')) return
    setOcupado(m.id)
    try {
      await rechazarMovimiento(m, perfilUid, perfilNombre)
      await onCambio()
    } finally {
      setOcupado(null)
    }
  }

  async function borrarUno(m: Movimiento) {
    if (ocupado) return
    if (!window.confirm(`¿Borrar el pendiente "${m.descripcion}"?`)) return
    setOcupado(m.id)
    try {
      await eliminarMovimientoPendiente(m.id)
      await onCambio()
    } finally {
      setOcupado(null)
    }
  }

  if (todas.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border-2 border-dashed border-stone-300 bg-white px-6 py-10 text-center animate-fade-up">
        <span className="text-4xl">📋</span>
        <p className="mt-2 text-lg font-extrabold text-stone-800">La planilla está vacía</p>
        <p className="mt-1 text-base text-stone-500">
          Sumá o restá un movimiento para comenzar esta planilla.
        </p>
      </section>
    )
  }

  const visiblesFila = todas.slice(0, visibles)
  const restantes = todas.length - visibles

  return (
    <section className="mt-8 animate-fade-up" style={{ animationDelay: '80ms' }}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900">Planilla</h2>
          <p className="text-sm font-semibold text-stone-500">
            Tocá una fecha para ver sus movimientos. El saldo corre hacia abajo.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
          {todas.length} {todas.length === 1 ? 'día' : 'días'}
        </span>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
        <table className="w-full min-w-[600px] border-separate border-spacing-0">
          <thead>
            <tr className="text-xs font-extrabold uppercase tracking-wide text-stone-500">
              <th className="px-4 py-3 text-right">Créditos</th>
              <th className="px-4 py-3 text-right">Débitos</th>
              <th className="px-4 py-3 text-right text-stone-700">Total</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {visiblesFila.map((f) => {
              const pend = f.movimientos.filter((m) => m.estado === 'pendiente')
              const abierto = expandido === f.fecha
              return (
                <Fragment key={f.fecha}>
                  <tr
                    className={`border-b border-stone-100 cursor-pointer transition ${
                      pend.length > 0 ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-stone-50'
                    } ${abierto ? 'bg-stone-100/70' : ''}`}
                    onClick={() => setExpandido(abierto ? null : f.fecha)}
                    title="Ver movimientos del día"
                  >
                    <td className="px-4 py-3.5 text-right font-extrabold tabular-nums text-emerald-600">
                      {f.creditos > 0 ? formatoPesos.format(f.creditos) : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold tabular-nums text-stone-800">
                      {f.debitos > 0 ? formatoPesos.format(f.debitos) : '—'}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-extrabold tabular-nums ${
                        f.saldoCorrido >= 0 ? 'text-stone-900' : 'text-rose-600'
                      }`}
                    >
                      {formatoPesos.format(f.saldoCorrido)}
                    </td>
                    <td className="px-4 py-3.5 text-left font-bold text-stone-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`inline-block transition-transform ${abierto ? 'rotate-90' : ''}`}
                        >
                          ▸
                        </span>
                        {formatoFecha(f.movimientos[0].fecha)}
                        {pend.length > 0 && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-bold text-amber-700">
                            {pend.length} pend.
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {pend.length > 0 ? (
                        <>
                          <button
                            type="button"
                            disabled={ocupado === f.fecha}
                            onClick={() => void confirmarDia(f.fecha, pend)}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
                            title="Confirmar movimientos de esta fecha"
                          >
                            {ocupado === f.fecha ? '…' : '✓ Confirmar'}
                          </button>
                          <button
                            type="button"
                            disabled={ocupado === f.fecha}
                            onClick={() => void rechazarDia(f.fecha, pend)}
                            className="ml-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                            title="Rechazar movimientos de esta fecha"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                          ✓
                        </span>
                      )}
                    </td>
                  </tr>
                  {abierto && (
                    <tr className={pend.length > 0 ? 'bg-amber-50/40' : ''}>
                      <td colSpan={5} className="px-4 pb-3">
                        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                          <ul>
                            {f.movimientos.map((m) => {
                              const esPendiente = m.estado === 'pendiente'
                              return (
                                <li
                                  key={m.id}
                                  className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3 last:border-0"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <span
                                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white text-sm ${
                                        m.tipo === 'credito' ? 'bg-emerald-500' : 'bg-stone-700'
                                      }`}
                                    >
                                      {m.tipo === 'credito' ? '＋' : '−'}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-base font-bold text-stone-800">
                                        {m.descripcion}
                                      </p>
                                      <p className="text-xs font-semibold text-stone-500">
                                        {esPendiente
                                          ? `Pendiente · lo cargó ${m.creadoPorNombre}`
                                          : `Confirmado${m.confirmadoPorNombre ? ` por ${m.confirmadoPorNombre}` : ''}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p
                                      className={`text-base font-extrabold tabular-nums ${
                                        m.tipo === 'credito' ? 'text-emerald-600' : 'text-stone-800'
                                      }`}
                                    >
                                      {m.tipo === 'credito' ? '+' : '−'}
                                      {formatoPesos.format(m.monto)}
                                    </p>
                                    {esPendiente ? (
                                      <>
                                        <button
                                          type="button"
                                          disabled={ocupado === m.id}
                                          onClick={() => void confirmarUno(m)}
                                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
                                          title="Confirmar este movimiento"
                                        >
                                          {ocupado === m.id ? '…' : '✓'}
                                        </button>
                                        <button
                                          type="button"
                                          disabled={ocupado === m.id}
                                          onClick={() => void rechazarUno(m)}
                                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                                          title="Rechazar este movimiento"
                                        >
                                          ✕
                                        </button>
                                        <button
                                          type="button"
                                          disabled={ocupado === m.id}
                                          onClick={() => onEditar(m)}
                                          className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm font-bold text-stone-700 transition hover:border-stone-400"
                                          title="Editar"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          type="button"
                                          disabled={ocupado === m.id}
                                          onClick={() => void borrarUno(m)}
                                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                                          title="Borrar"
                                        >
                                          🗑️
                                        </button>
                                      </>
                                    ) : (
                                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                        ✓ Confirmado
                                      </span>
                                    )}
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {restantes > 0 && (
        <button
          type="button"
          onClick={() => setVisibles((v) => v + DIAS_POR_VISTA)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-4 text-base font-bold text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400"
        >
          Cargar más registros ({Math.min(restantes, DIAS_POR_VISTA) === 1 ? '1 día más' : `${Math.min(restantes, DIAS_POR_VISTA)} días más`})
        </button>
      )}

      {visiblesFila.length > 0 && (
        <p className="mt-3 text-center text-sm font-semibold text-stone-400">
          Mostrando {visiblesFila.length} de {todas.length} días
        </p>
      )}
    </section>
  )
}

function agruparPorFecha(movimientos: Movimiento[]): {
  fecha: string
  movimientos: Movimiento[]
  creditos: number
  debitos: number
  neto: number
}[] {
  const mapa = new Map<string, Movimiento[]>()
  for (const m of movimientos) {
    const key = aYmd(m.fecha)
    const arr = mapa.get(key)
    if (arr) arr.push(m)
    else mapa.set(key, [m])
  }
  return Array.from(mapa.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([fecha, movimientos]) => {
      const creditos = movimientos.filter((m) => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0)
      const debitos = movimientos.filter((m) => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0)
      return { fecha, movimientos, creditos, debitos, neto: creditos - debitos }
    })
}

function ListaConfirmados({ confirmados }: { confirmados: Movimiento[] }) {
  if (confirmados.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border-2 border-dashed border-stone-300 bg-white px-6 py-10 text-center animate-fade-up">
        <span className="text-4xl">✅</span>
        <p className="mt-2 text-lg font-extrabold text-stone-800">Aún no hay movimientos confirmados</p>
        <p className="mt-1 text-base text-stone-500">
          Cuando el dueño confirme los pendientes, quedan registrados acá para siempre.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-8 animate-fade-up" style={{ animationDelay: '140ms' }}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-stone-900">Confirmados</h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
          {confirmados.length}
        </span>
      </div>
      <ul className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
        {confirmados.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 last:border-0">
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-stone-800">{m.descripcion}</p>
              <p className="text-sm font-semibold text-stone-500">
                {formatoFecha(m.fecha)} · Confirmado
              </p>
            </div>
            <p
              className={`shrink-0 text-lg font-extrabold tabular-nums ${m.tipo === 'credito' ? 'text-emerald-600' : 'text-stone-800'}`}
            >
              {m.tipo === 'credito' ? '+' : '−'}
              {formatoPesos.format(m.monto)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Esqueleto() {
  return (
    <div className="min-h-svh">
      <div className="skeleton h-16 w-full" />
      <div className="mx-auto max-w-3xl space-y-4 px-5 pt-6 sm:px-10">
        <div className="skeleton h-28 rounded-3xl" />
        <div className="skeleton h-80 rounded-3xl" />
      </div>
    </div>
  )
}

export default FichaCliente