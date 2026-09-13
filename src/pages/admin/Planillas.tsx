import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Cliente, Movimiento } from '../../types'
import { listarClientes } from '../../services/clientesService'
import { listarAgencias, listarPendientes } from '../../services/movimientosService'
import { normalizar } from '../../utils/normalizar'

type Agencia = { id: string; numero: number; nombre: string }

function Planillas() {
  const [lista, setLista] = useState<Cliente[] | null>(null)
  const [agencias, setAgencias] = useState<Agencia[]>([])
  const [pendientes, setPendientes] = useState<Movimiento[]>([])
  const [filtroAgencia, setFiltroAgencia] = useState('todas')
  const [termino, setTermino] = useState('')
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null)

  useEffect(() => {
    let activo = true
    void Promise.all([listarClientes(), listarAgencias(), listarPendientes()])
      .then(([c, a, p]) => {
        if (!activo) return
        setLista(c)
        setAgencias(a)
        setPendientes(p)
      })
      .catch(() => {
        if (activo) setMensaje({ tipo: 'err', texto: 'No se pudieron cargar las planillas.' })
      })
    return () => {
      activo = false
    }
  }, [])

  const filtrados = useMemo(() => {
    if (lista === null) return null
    const t = normalizar(termino)
    return lista
      .filter((c) => filtroAgencia === 'todas' || c.agenciaId === filtroAgencia)
      .filter((c) => t.length === 0 || `${normalizar(c.apellido)} ${normalizar(c.nombre)}`.includes(t))
      .sort((a, b) => a.apellido.localeCompare(b.apellido))
  }, [lista, filtroAgencia, termino])

  const pendientesPorCliente = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const m of pendientes) {
      mapa.set(m.clienteId, (mapa.get(m.clienteId) ?? 0) + 1)
    }
    return mapa
  }, [pendientes])

  const nombreAgencia = (id: string) => {
    const a = agencias.find((x) => x.id === id)
    return a ? `Agencia ${a.numero}` : `Agencia ${id}`
  }

  const cantidadPendientes = (clienteId: string) => pendientesPorCliente.get(clienteId) ?? 0

  const totalPendientes = lista
    ? lista.reduce((s, c) => s + cantidadPendientes(c.id), 0)
    : 0

  return (
    <section className="pt-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 animate-fade-up">
        <h1 className="text-xl font-extrabold text-stone-900">Planillas</h1>
        <p className="mt-0.5 text-base text-stone-500">
          {totalPendientes > 0 ? (
            <span>
              Hay <strong className="text-amber-700">{totalPendientes} movimientos pendientes</strong> por
              confirmar. Abrí la planilla del cliente para confirmarlos ahí.
            </span>
          ) : (
            'Sin movimientos pendientes por confirmar.'
          )}
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

      {lista !== null && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100 sm:flex-row animate-fade-up">
          <select
            value={filtroAgencia}
            onChange={(e) => setFiltroAgencia(e.target.value)}
            className="campo sm:w-56"
            aria-label="Filtrar por agencia"
          >
            <option value="todas">Todas las agencias</option>
            {agencias.map((a) => (
              <option key={a.id} value={a.id}>
                Agencia {a.numero}
              </option>
            ))}
          </select>
          <input
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            className="campo flex-1"
            placeholder="Buscar por apellido…"
          />
        </div>
      )}

      {filtrados === null ? (
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="mt-5 rounded-2xl border-2 border-dashed border-stone-300 bg-white px-6 py-12 text-center">
          <span className="text-4xl">📋</span>
          <p className="mt-2 text-lg font-extrabold text-stone-800">Sin clientes</p>
          <p className="mt-1 text-base text-stone-500">
            {lista?.length === 0
              ? 'Creá un cliente en la pestaña "Clientes" para comenzar la primera planilla.'
              : 'No hay clientes que coincidan con la búsqueda.'}
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {filtrados.map((c, i) => {
            const pend = cantidadPendientes(c.id)
            return (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 transition hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-extrabold text-white uppercase">
                    {c.nombre[0]}
                    {c.apellido[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold text-stone-800">
                      {c.apellido} <span className="font-semibold text-stone-500">{c.nombre}</span>
                    </p>
                    <p className="text-base font-semibold text-stone-500">{nombreAgencia(c.agenciaId)}</p>
                    {pend > 0 && <p className="text-base font-semibold text-amber-700">{pend} pendiente(s)</p>}
                  </div>
                </div>
                <Link
                  to={`/agencia/${c.agenciaId}/clientes/${c.id}`}
                  className={`rounded-xl px-5 py-2.5 text-base font-bold transition ${
                    pend > 0
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 hover:-translate-y-0.5 hover:bg-amber-700'
                      : 'bg-coal-950 text-white shadow-lg shadow-stone-900/20 hover:-translate-y-0.5 hover:bg-stone-800'
                  }`}
                >
                  {pend > 0 ? 'Confirmar en planilla' : 'Ver planilla'}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default Planillas