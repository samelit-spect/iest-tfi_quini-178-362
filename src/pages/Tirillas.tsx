import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth'
import {
  leerAgencia,
  leerMovimientosConfirmadosPorAgencia,
  actualizarComisionPorcentaje,
} from '../services/movimientosService'
import { listarClientesPorAgencia } from '../services/clientesService'
import {
  leerTirilla,
  guardarTirilla,
  listarTirillas,
  leerUltimaTirilla,
} from '../services/tirillasService'
import { formatoPesos } from '../utils/format'
import { exportarTirillaCSV } from '../utils/exportar'
import NavAdmin from '../components/NavAdmin'
import type { ConceptoOtro, Movimiento, TurnoTirilla } from '../types'

function hoyYmd() {
  return new Date().toISOString().slice(0, 10)
}

function defaultTurno(): TurnoTirilla {
  return new Date().getHours() < 12 ? 'manana' : 'tarde'
}

function Tirillas() {
  const { agenciaId } = useParams<{ agenciaId: string }>()
  const { perfil } = useAuth()
  const isAdmin = perfil?.rol === 'admin'
  const perfilUid = perfil?.uid ?? ''
  const perfilNombre = perfil?.nombre ?? ''

  const [agencia, setAgencia] = useState<{
    id: string
    numero: number
    nombre: string
    comisionPorcentaje: number
  } | null>(null)
  const [fecha, setFecha] = useState(hoyYmd)
  const [turno, setTurno] = useState<TurnoTirilla>(defaultTurno)
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [clientesMap, setClientesMap] = useState<Record<string, string>>({})
  const [tirillaId, setTirillaId] = useState<string | null>(null)
  const [ventas, setVentas] = useState('0')
  const [premios, setPremios] = useState('0')
  const [caja, setCaja] = useState('0')
  const [diferenciaAnterior, setDiferenciaAnterior] = useState('0')
  const [otros, setOtros] = useState<ConceptoOtro[]>([])
  const [comisionPorcentaje, setComisionPorcentaje] = useState(8)
  const [historial, setHistorial] = useState<
    { fecha: string; turno: TurnoTirilla; ventas: number; diferencia: number }[]
  >([])
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    let activo = true
    async function cargar() {
      if (!agenciaId) return
      const ag = await leerAgencia(agenciaId)
      if (!activo) return
      setAgencia(ag)
      setComisionPorcentaje(ag?.comisionPorcentaje ?? 8)
      const [clientes, confirmados, historialTirillas] = await Promise.all([
        listarClientesPorAgencia(agenciaId),
        leerMovimientosConfirmadosPorAgencia(agenciaId),
        listarTirillas(agenciaId),
      ])
      if (!activo) return
      setClientesMap(Object.fromEntries(clientes.map((c) => [c.id, `${c.apellido} ${c.nombre}`])))
      setMovimientos(confirmados)
      setHistorial(
        historialTirillas.map((t) => ({
          fecha: t.fecha,
          turno: t.turno,
          ventas: t.ventas,
          diferencia: t.diferencia,
        })),
      )
      const ultima = await leerUltimaTirilla(agenciaId)
      if (activo) setDiferenciaAnterior(ultima ? String(ultima.diferencia) : '0')
    }
    void cargar()
    return () => {
      activo = false
    }
  }, [agenciaId])

  useEffect(() => {
    let activo = true
    async function buscar() {
      if (!agenciaId) return
      setTirillaId(null)
      const t = await leerTirilla(agenciaId, fecha, turno)
      if (!activo) return
      if (t) {
        setTirillaId(t.id)
        setVentas(String(t.ventas))
        setPremios(String(t.premios))
        setCaja(String(t.caja))
        setDiferenciaAnterior(String(t.diferenciaAnterior))
        setOtros(t.otros)
        setComisionPorcentaje(t.comisionPorcentaje)
      } else {
        setVentas('0')
        setPremios('0')
        setCaja('0')
        setOtros([])
        setComisionPorcentaje(agencia?.comisionPorcentaje ?? 8)
      }
    }
    void buscar()
    return () => {
      activo = false
    }
  }, [agenciaId, fecha, turno, agencia?.comisionPorcentaje])

  const movimientosDelDia = useMemo(
    () => movimientos.filter((m) => m.fecha.slice(0, 10) === fecha),
    [movimientos, fecha],
  )
  const totalCreditos = useMemo(
    () => movimientosDelDia.filter((m) => m.tipo === 'credito').reduce((s, m) => s + m.monto, 0),
    [movimientosDelDia],
  )
  const totalDebitos = useMemo(
    () => movimientosDelDia.filter((m) => m.tipo === 'debito').reduce((s, m) => s + m.monto, 0),
    [movimientosDelDia],
  )
  const comisionCalc = useMemo(
    () => Math.round((Number(ventas) || 0) * comisionPorcentaje / 100),
    [ventas, comisionPorcentaje],
  )
  const otrosTotal = useMemo(
    () => otros.reduce((s, o) => s + (Number(o.importe) || 0), 0),
    [otros],
  )
  const diferenciaCalc = useMemo(() => {
    const v = Number(ventas) || 0
    const p = Number(premios) || 0
    const c = Number(caja) || 0
    const da = Number(diferenciaAnterior) || 0
    return v - p - c + da - comisionCalc - otrosTotal
  }, [ventas, premios, caja, diferenciaAnterior, comisionCalc, otrosTotal])

  async function guardar() {
    if (!agenciaId || guardando) return
    setGuardando(true)
    setMensaje(null)
    try {
      await guardarTirilla(
        {
          agenciaId,
          fecha,
          turno,
          ventas: Number(ventas) || 0,
          premios: Number(premios) || 0,
          caja: Number(caja) || 0,
          diferenciaAnterior: Number(diferenciaAnterior) || 0,
          otros,
          comisionPorcentaje,
          comision: comisionCalc,
          diferencia: diferenciaCalc,
          creador: { uid: perfilUid, nombre: perfilNombre },
        },
        tirillaId,
      )
      if (isAdmin) await actualizarComisionPorcentaje(agenciaId, comisionPorcentaje)
      setMensaje('Tirilla guardada correctamente.')
    } catch {
      setMensaje('No se pudo guardar. Intentalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="min-h-svh pb-16">
      <header className="no-print sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 bg-white/80 px-5 py-3 backdrop-blur sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-coal-950 text-lg font-extrabold text-white shadow-lg rotate-3">
            FQ
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">
              Agencia {agencia?.numero ?? agenciaId} · Tirilla
            </p>
            <p className="text-sm font-semibold text-stone-500">
              {isAdmin ? 'Cierre de turno — administración' : 'Tu cierre de turno'}
            </p>
          </div>
        </div>
        {isAdmin ? (
          <NavAdmin />
        ) : (
          <Link
            to={`/agencia/${agenciaId}`}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
          >
            ← Volver
          </Link>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div className="no-print mt-6 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              max={hoyYmd()}
              onChange={(e) => setFecha(e.target.value)}
              className="campo"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">
              Turno
            </label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value as TurnoTirilla)}
              className="campo"
            >
              <option value="manana">Mañana (apertura)</option>
              <option value="tarde">Tarde (cierre)</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2 pb-1">
            <button
              type="button"
              onClick={() =>
                exportarTirillaCSV(
                  `tirilla-agencia-${agencia?.numero ?? agenciaId}-${fecha}-${turno}.csv`,
                  {
                    id: tirillaId ?? '',
                    agenciaId: agenciaId ?? '',
                    fecha,
                    turno,
                    ventas: Number(ventas) || 0,
                    premios: Number(premios) || 0,
                    caja: Number(caja) || 0,
                    diferenciaAnterior: Number(diferenciaAnterior) || 0,
                    otros,
                    comisionPorcentaje,
                    comision: comisionCalc,
                    diferencia: diferenciaCalc,
                    creadoPor: '',
                    creadoPorNombre: '',
                    creadoEl: '',
                  },
                  otros,
                )
              }
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
              title="Descargar la tirilla en formato Excel (.csv)"
            >
              📥 Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-stone-400"
              title="Imprimir o guardar como PDF"
            >
              🖨️ PDF
            </button>
          </div>
          {historial.length > 0 && (
            <span className="ml-auto rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">
              {historial.length} tirilla{historial.length !== 1 && 's'}
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* ———————————————————————————————————— COL 1: CLIENTES ———————————————————————————————————— */}
          <section className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-lg">📋</span>
              <h2 className="text-lg font-extrabold text-stone-900">Créditos y débitos del día</h2>
            </div>
            <p className="mt-1 text-sm font-medium text-stone-500">
              {movimientosDelDia.length} movimiento{movimientosDelDia.length !== 1 && 's'} confirmado
              {movimientosDelDia.length !== 1 && 's'}
            </p>

            <ul className="mt-4 flex-1 space-y-2 overflow-auto pr-1 max-h-[50vh]">
              {movimientosDelDia.length === 0 && (
                <li className="py-8 text-center text-sm font-medium text-stone-400">
                  No hay movimientos confirmados para esta fecha.
                </li>
              )}
              {movimientosDelDia.map((m) => {
                const esCredito = m.tipo === 'credito'
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-stone-800">
                        {clientesMap[m.clienteId] || 'Cliente'}
                      </p>
                      {m.descripcion && (
                        <p className="truncate text-xs font-medium text-stone-500">{m.descripcion}</p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-sm font-extrabold tabular-nums ${esCredito ? 'text-emerald-600' : 'text-stone-800'}`}
                    >
                      {esCredito ? '+' : '−'}
                      {formatoPesos.format(m.monto)}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 space-y-1.5 rounded-xl bg-stone-50 p-3 text-sm">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-700">Créditos</span>
                <span className="text-emerald-600">+{formatoPesos.format(totalCreditos)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-stone-600">Débitos</span>
                <span className="text-stone-800">−{formatoPesos.format(totalDebitos)}</span>
              </div>
              <div className="h-px bg-stone-200" />
              <div className="flex justify-between font-extrabold text-base">
                <span>Neto del día</span>
                <span>{formatoPesos.format(totalCreditos - totalDebitos)}</span>
              </div>
            </div>
          </section>

          {/* ———————————————————————————————— COL 2: CONCEPTOS ——————————————————————————————————————— */}
          <section className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-lg">💰</span>
              <h2 className="text-lg font-extrabold text-stone-900">Conceptos del cierre</h2>
            </div>

            <div className="mt-4 flex-1 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Premios pagados
                </label>
                <input
                  type="number"
                  min={0}
                  className="campo w-full"
                  value={premios}
                  onChange={(e) => setPremios(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Caja recibida
                </label>
                <input
                  type="number"
                  min={0}
                  className="campo w-full"
                  value={caja}
                  onChange={(e) => setCaja(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Diferencia del día anterior
                </label>
                <input
                  type="number"
                  className="campo w-full"
                  value={diferenciaAnterior}
                  onChange={(e) => setDiferenciaAnterior(e.target.value)}
                />
                {Number(diferenciaAnterior) < 0 && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">
                    El agenciero quedó debiendo del cierre anterior
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-stone-50 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-stone-800">Otros conceptos</h3>
                  <button
                    type="button"
                    onClick={() => setOtros([...otros, { concepto: '', importe: 0 }])}
                    className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-stone-700"
                  >
                    + Agregar
                  </button>
                </div>
                <ul className="mt-2 space-y-2">
                  {otros.map((o, i) => (
                    <li key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: Limpieza, mechudo…"
                        className="campo flex-1"
                        value={o.concepto}
                        onChange={(e) => {
                          const copia = [...otros]
                          copia[i] = { ...copia[i], concepto: e.target.value }
                          setOtros(copia)
                        }}
                      />
                      <input
                        type="number"
                        min={0}
                        className="campo w-24"
                        value={o.importe || ''}
                        onChange={(e) => {
                          const copia = [...otros]
                          copia[i] = { ...copia[i], importe: Number(e.target.value) || 0 }
                          setOtros(copia)
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setOtros(otros.filter((_, j) => j !== i))}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                        title="Quitar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                {otros.length > 0 && (
                  <p className="mt-2 text-right text-sm font-bold text-stone-600">
                    Subtotal otros: {formatoPesos.format(otrosTotal)}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ————————————————————————————————— COL 3: CIERRE ——————————————————————————————————— */}
          <section className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-lg">🧮</span>
              <h2 className="text-lg font-extrabold text-stone-900">Cierre</h2>
            </div>

            <div className="mt-4 flex-1 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Total de ventas
                </label>
                <input
                  type="number"
                  min={0}
                  className="campo w-full text-lg"
                  value={ventas}
                  onChange={(e) => setVentas(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500">
                  % comisión del agenciero
                  {!isAdmin && (
                    <span className="ml-1 normal-case text-stone-400">(fijo por la agencia)</span>
                  )}
                </label>
                {isAdmin ? (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    className="campo w-full"
                    value={comisionPorcentaje}
                    onChange={(e) => setComisionPorcentaje(Number(e.target.value) || 0)}
                  />
                ) : (
                  <div className="campo flex items-center justify-between bg-stone-50">
                    <span>{comisionPorcentaje}%</span>
                    <span className="text-sm font-bold text-stone-500">editable por admin</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-stone-50 p-4 space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-stone-600">Comisión</span>
                  <span>{formatoPesos.format(comisionCalc)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-stone-600">Premios + caja</span>
                  <span>
                    {formatoPesos.format((Number(premios) || 0) + (Number(caja) || 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-stone-600">Otros conceptos</span>
                  <span>{formatoPesos.format(otrosTotal)}</span>
                </div>
                <div className="h-px bg-stone-200" />
                <div className="flex items-center justify-between text-lg font-extrabold">
                  <span>Diferencia</span>
                  <span
                    className={`${
                      diferenciaCalc >= 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {diferenciaCalc >= 0 ? '+' : ''}
                    {formatoPesos.format(diferenciaCalc)}
                  </span>
                </div>
                <p className="text-[11px] leading-tight text-stone-400">
                  Ventas − premios − caja + diferencia anterior − comisión − otros = diferencia
                </p>
                {diferenciaCalc < 0 && (
                  <p className="text-xs font-semibold text-rose-600">
                    El agenciero quedó debiendo este monto
                  </p>
                )}
              </div>

              {mensaje && (
                <p
                  className={`rounded-xl px-3 py-2 text-sm font-bold ${
                    mensaje.includes('correctamente')
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {mensaje}
                </p>
              )}

              <button
                type="button"
                onClick={() => void guardar()}
                disabled={guardando}
                className="w-full rounded-xl bg-coal-950 px-4 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-coal-800 disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : tirillaId ? 'Actualizar tirilla' : 'Guardar tirilla'}
              </button>
            </div>
          </section>
        </div>

        {/* ———————————————————————————————— HISTORIAL ————————————————————————————————————— */}
        {historial.length > 0 && (
          <section className="no-print mt-10 animate-fade-up">
            <h2 className="text-lg font-extrabold text-stone-900">Historial de tirillas</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {historial.map((h, i) => (
                <li
                  key={`${h.fecha}-${h.turno}`}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 transition hover:shadow-md"
                  style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
                >
                  <p className="text-sm font-extrabold text-stone-900">
                    {new Date(`${h.fecha}T12:00:00`).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    ·{' '}
                    <span className="font-bold capitalize text-stone-600">
                      {h.turno === 'manana' ? 'Mañana' : 'Tarde'}
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-bold text-stone-500">
                    Ventas: {formatoPesos.format(h.ventas)}
                  </p>
                  <p
                    className={`text-sm font-extrabold ${h.diferencia >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    Diferencia: {h.diferencia >= 0 ? '+' : ''}
                    {formatoPesos.format(h.diferencia)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default Tirillas