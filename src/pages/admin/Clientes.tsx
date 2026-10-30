import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { Cliente } from '../../types'
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
} from '../../services/clientesService'
import { listarAgencias } from '../../services/movimientosService'
import { normalizar } from '../../utils/normalizar'

type Agencia = { id: string; numero: number; nombre: string }
type Modal = { modo: 'crear' } | { modo: 'editar'; cliente: Cliente } | null

function Clientes() {
  const [lista, setLista] = useState<Cliente[] | null>(null)
  const [agencias, setAgencias] = useState<Agencia[]>([])
  const [filtroAgencia, setFiltroAgencia] = useState('todas')
  const [termino, setTermino] = useState('')
  const [modal, setModal] = useState<Modal>(null)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null)

  async function cargar() {
    const [c, a] = await Promise.all([listarClientes(), listarAgencias()])
    setLista(c)
    setAgencias(a)
  }

  useEffect(() => {
    let activo = true
    void Promise.all([listarClientes(), listarAgencias()])
      .then(([c, a]) => {
        if (!activo) return
        setLista(c)
        setAgencias(a)
      })
      .catch(() => {
        if (activo) setMensaje({ tipo: 'err', texto: 'No se pudieron cargar los clientes.' })
      })
    return () => {
      activo = false
    }
  }, [])

  function avisar(tipo: 'ok' | 'err', texto: string) {
    setMensaje({ tipo, texto })
  }

  async function guardar(datos: Formulario) {
    try {
      if (modal?.modo === 'editar') {
        await actualizarCliente(modal.cliente.id, datos)
        avisar('ok', `Cliente ${datos.apellido} ${datos.nombre} actualizado.`)
      } else {
        await crearCliente(datos)
        avisar('ok', `Cliente ${datos.apellido} ${datos.nombre} creado.`)
      }
      setModal(null)
      await cargar()
    } catch {
      avisar('err', 'No se pudo guardar el cliente. Intentalo de nuevo.')
    }
  }

  async function borrar(c: Cliente) {
    if (
      !window.confirm(
        `¿Eliminar a ${c.apellido} ${c.nombre}? Esta acción no se puede deshacer.`,
      )
    )
      return
    try {
      await eliminarCliente(c.id, c.agenciaId)
      avisar('ok', `Cliente ${c.apellido} ${c.nombre} eliminado.`)
      await cargar()
    } catch (err) {
      if ((err as Error).message === 'CLIENTE_CON_MOVIMIENTOS') {
        avisar(
          'err',
          'No se puede eliminar: el cliente tiene movimientos registrados. Conservá el historial.',
        )
        return
      }
      avisar('err', 'No se pudo eliminar el cliente. Intentalo de nuevo.')
    }
  }

  const filtrados = useMemo(() => {
    if (lista === null) return null
    const t = normalizar(termino)
    return lista
      .filter((c) => filtroAgencia === 'todas' || c.agenciaId === filtroAgencia)
      .filter((c) => t.length === 0 || `${normalizar(c.apellido)} ${normalizar(c.nombre)}`.includes(t))
      .sort((a, b) => a.apellido.localeCompare(b.apellido))
  }, [lista, filtroAgencia, termino])

  const nombreAgencia = (id: string) => {
    const a = agencias.find((x) => x.id === id)
    return a ? `Agencia ${a.numero}` : `Agencia ${id}`
  }

  return (
    <section className="pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 animate-fade-up">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">Clientes</h1>
          <p className="mt-0.5 text-base text-stone-500">
            Dadas de alta por agencia. En el inicio, cualquiera puede buscarlos y ver su planilla.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ modo: 'crear' })}
          className="flex items-center gap-2 rounded-xl bg-coal-950 px-5 py-3 text-base font-bold text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5 hover:bg-stone-800"
        >
          <span className="text-lg leading-none">＋</span> Nuevo cliente
        </button>
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
          <span className="text-4xl">🧾</span>
          <p className="mt-2 text-lg font-extrabold text-stone-800">Sin clientes</p>
          <p className="mt-1 text-base text-stone-500">
            {lista?.length === 0 ? 'Dale a "Nuevo cliente" para cargar la primera ficha.' : 'No hay clientes que coincidan con la búsqueda.'}
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {filtrados.map((c, i) => (
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
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModal({ modo: 'editar', cliente: c })}
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => void borrar(c)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal && <ModalCliente modal={modal} agencias={agencias} onCerrar={() => setModal(null)} onGuardar={guardar} />}
    </section>
  )
}

type Formulario = { apellido: string; nombre: string; agenciaId: string }

function ModalCliente({
  modal,
  agencias,
  onCerrar,
  onGuardar,
}: {
  modal: Exclude<Modal, null>
  agencias: Agencia[]
  onCerrar: () => void
  onGuardar: (d: Formulario) => Promise<void>
}) {
  const editando = modal.modo === 'editar' ? modal.cliente : null
  const [apellido, setApellido] = useState(editando?.apellido ?? '')
  const [nombre, setNombre] = useState(editando?.nombre ?? '')
  const [agenciaId, setAgenciaId] = useState(editando?.agenciaId ?? agencias[0]?.id ?? '')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (enviando) return
    if (!apellido.trim()) return setError('Falta el apellido del cliente.')
    if (!nombre.trim()) return setError('Falta el nombre del cliente.')
    if (!agenciaId) return setError('Elegí la agencia del cliente.')
    setError('')
    setEnviando(true)
    onGuardar({
      apellido: apellido.trim(),
      nombre: nombre.trim(),
      agenciaId,
    }).finally(() => setEnviando(false))
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onCerrar}
    >
      <form
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-scale-in sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              {editando ? 'Editar cliente' : 'Nuevo cliente'}
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">
              {editando
                ? `${editando.apellido} ${editando.nombre}`
                : 'El cliente podrá ver su planilla sin registrarse.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-lg font-bold text-stone-500 transition hover:bg-stone-200"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Campo label="Apellido" htmlFor="apellido">
            <input
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="campo"
              placeholder="Ej: Pérez"
              autoFocus
            />
          </Campo>
          <Campo label="Nombre" htmlFor="nombre">
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="campo"
              placeholder="Ej: Juan"
            />
          </Campo>
          <Campo label="Agencia" htmlFor="agencia">
            <select id="agencia" value={agenciaId} onChange={(e) => setAgenciaId(e.target.value)} className="campo">
              {agencias.map((a) => (
                <option key={a.id} value={a.id}>
                  Agencia {a.numero}
                </option>
              ))}
            </select>
          </Campo>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-coal-950 px-6 py-3.5 text-lg font-bold text-white shadow-lg transition hover:bg-stone-800 disabled:opacity-60"
          >
            {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Campo({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold text-stone-700">
        {label}
      </label>
      {children}
    </div>
  )
}

export default Clientes