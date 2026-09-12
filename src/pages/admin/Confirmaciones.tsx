import { useEffect, useState } from 'react'
import type { Cliente, Movimiento } from '../../types'
import {
  confirmarMovimiento,
  listarAgencias,
  listarPendientes,
  rechazarMovimiento,
} from '../../services/movimientosService'
import { listarClientes } from '../../services/clientesService'
import { formatoFecha, formatoPesos } from '../../utils/format'
import { useAuth } from '../../context/auth'

type Agencia = { id: string; numero: number; nombre: string }

function Confirmaciones() {
  const { perfil } = useAuth()
  const [pendientes, setPendientes] = useState<Movimiento[] | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [agencias, setAgencias] = useState<Agencia[]>([])
  const [operando, setOperando] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null)

  async function cargar() {
    const [p, c, a] = await Promise.all([listarPendientes(), listarClientes(), listarAgencias()])
    setPendientes(p)
    setClientes(c)
    setAgencias(a)
  }

  useEffect(() => {
    let activo = true
    void Promise.all([listarPendientes(), listarClientes(), listarAgencias()])
      .then(([p, c, a]) => {
        if (!activo) return
        setPendientes(p)
        setClientes(c)
        setAgencias(a)
      })
      .catch(() => {
        if (activo) setMensaje({ tipo: 'err', texto: 'No se pudieron cargar los movimientos.' })
      })
    return () => {
      activo = false
    }
  }, [])

  const nombreCliente = (id: string) => {
    const c = clientes.find((x) => x.id === id)
    return c ? `${c.apellido} ${c.nombre}` : 'Cliente'
  }
  const numeroAgencia = (id: string) => agencias.find((a) => a.id === id)?.numero ?? id

  async function accion(m: Movimiento, tipo: 'confirmar' | 'rechazar') {
    if (!perfil || operando) return
    if (tipo === 'rechazar' && !window.confirm('¿Rechazar este movimiento? El cliente lo verá como rechazado.')) return
    setOperando(m.id)
    try {
      if (tipo === 'confirmar') {
        await confirmarMovimiento(m, perfil.uid, perfil.nombre)
        setMensaje({ tipo: 'ok', texto: 'Movimiento confirmado. Ya no puede modificarse.' })
      } else {
        await rechazarMovimiento(m, perfil.uid, perfil.nombre)
        setMensaje({ tipo: 'ok', texto: 'Movimiento rechazado.' })
      }
      await cargar()
    } catch {
      setMensaje({ tipo: 'err', texto: 'No se pudo procesar el movimiento. Intentalo de nuevo.' })
    } finally {
      setOperando(null)
    }
  }

  return (
    <section className="pt-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 animate-fade-up">
        <h1 className="text-xl font-extrabold text-stone-900">Movimientos por confirmar</h1>
        <p className="mt-0.5 text-base text-stone-500">
          Cuando confirmás un movimiento queda registrado para siempre. Al rechazarlo, no se agrega a la planilla.
        </p>
      </div>

      {mensaje && (
        <div
          className={`mt-4 rounded-xl px-5 py-3 text-base font-semibold animate-fade-up ${
            mensaje.tipo === 'ok'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {pendientes === null ? (
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : pendientes.length === 0 ? (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-stone-300 bg-white px-6 py-14 text-center animate-fade-up">
          <span className="text-5xl">🎉</span>
          <p className="text-xl font-extrabold text-stone-800">Sin movimientos pendientes</p>
          <p className="max-w-sm text-base text-stone-500">
            Cuando los empleados carguen sumas o restas en las planillas, van a aparecer acá para que las confirmes.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {pendientes.map((m, i) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg shadow-md ${
                    m.tipo === 'credito'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-coal-950 text-white shadow-stone-900/20'
                  }`}
                >
                  {m.tipo === 'credito' ? '＋' : '−'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-extrabold text-stone-800">
                    {nombreCliente(m.clienteId)}
                    <span className="ml-2 rounded-full bg-stone-100 px-2.5 py-0.5 align-middle text-sm font-bold text-stone-600">
                      Ag. {numeroAgencia(m.agenciaId)}
                    </span>
                  </p>
                  <p className="truncate text-base text-stone-600">{m.descripcion}</p>
                  <p className="text-sm font-semibold text-stone-400">
                    {formatoFecha(m.fecha)} · cargado por {m.creadoPorNombre}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <p
                  className={`text-xl font-extrabold tabular-nums ${
                    m.tipo === 'credito' ? 'text-emerald-600' : 'text-stone-800'
                  }`}
                >
                  {m.tipo === 'credito' ? '+' : '−'}
                  {formatoPesos.format(m.monto)}
                </p>
                <button
                  type="button"
                  disabled={operando === m.id}
                  onClick={() => void accion(m, 'confirmar')}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-base font-bold text-white shadow-md shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {operando === m.id ? '…' : 'Confirmar'}
                </button>
                <button
                  type="button"
                  disabled={operando === m.id}
                  onClick={() => void accion(m, 'rechazar')}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-base font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Confirmaciones