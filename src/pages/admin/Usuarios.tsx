import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Rol, Usuario } from '../../types'
import {
  actualizarUsuario,
  crearCuentaAuth,
  crearUsuarioDoc,
  listarUsuarios,
} from '../../services/usuariosService'
import { listarAgencias } from '../../services/movimientosService'
import { useAuth } from '../../context/auth'

const ERRORES_AUTH: Record<string, string> = {
  EMAIL_EXISTS: 'Ya existe un usuario con ese correo.',
  INVALID_EMAIL: 'El correo no es válido.',
  MISSING_PASSWORD: 'Falta la contraseña.',
  WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'Demasiados intentos. Esperá un momento y volvé a intentar.',
}

type Agencia = { id: string; numero: number; nombre: string }
type Modal = { modo: 'crear' } | { modo: 'editar'; usuario: Usuario } | null

function Usuarios() {
  const { perfil } = useAuth()
  const [lista, setLista] = useState<Usuario[] | null>(null)
  const [agencias, setAgencias] = useState<Agencia[]>([])
  const [modal, setModal] = useState<Modal>(null)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null)

  async function cargar() {
    const [u, a] = await Promise.all([listarUsuarios(), listarAgencias()])
    setLista(u)
    setAgencias(a)
  }

  useEffect(() => {
    let activo = true
    void Promise.all([listarUsuarios(), listarAgencias()])
      .then(([u, a]) => {
        if (!activo) return
        setLista(u)
        setAgencias(a)
      })
      .catch(() => {
        if (activo) setMensaje({ tipo: 'err', texto: 'No se pudieron cargar los usuarios.' })
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
        await actualizarUsuario(modal.usuario.uid, {
          nombre: datos.nombre,
          rol: datos.rol,
          agenciaId: datos.rol === 'empleado' ? datos.agenciaId : null,
        })
        avisar('ok', `Usuario ${datos.nombre} actualizado.`)
      } else {
        const uid = await crearCuentaAuth(datos.email, datos.password)
        await crearUsuarioDoc(uid, {
          email: datos.email,
          nombre: datos.nombre,
          rol: datos.rol,
          agenciaId: datos.rol === 'empleado' ? datos.agenciaId : null,
        })
        avisar('ok', `Usuario ${datos.nombre} creado correctamente.`)
      }
      setModal(null)
      await cargar()
    } catch (err) {
      const code = (err as Error).message ?? ''
      avisar('err', ERRORES_AUTH[code] ?? 'No se pudo guardar el usuario. Intentalo de nuevo.')
    }
  }

  async function cambiarEstado(u: Usuario) {
    if (u.uid === perfil?.uid && u.activo) {
      avisar('err', 'No podés deshabilitar tu propia cuenta.')
      return
    }
    const accion = u.activo ? 'deshabilitar' : 'habilitar'
    if (!window.confirm(`¿Seguro que querés ${accion} a ${u.nombre}?`)) return
    try {
      await actualizarUsuario(u.uid, { activo: !u.activo })
      avisar('ok', `${u.nombre} fue ${u.activo ? 'deshabilitado' : 'habilitado'}.`)
      await cargar()
    } catch {
      avisar('err', 'No se pudo actualizar el estado.')
    }
  }

  return (
    <section className="pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 animate-fade-up">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900">Usuarios del sistema</h1>
          <p className="mt-0.5 text-base text-stone-500">
            Creá las cuentas del personal y controlá quienes ingresan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ modo: 'crear' })}
          className="flex items-center gap-2 rounded-xl bg-coal-950 px-5 py-3 text-base font-bold text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5 hover:bg-stone-800"
        >
          <span className="text-lg leading-none">＋</span> Nuevo usuario
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

      {lista === null ? (
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {lista.map((u, i) => {
            const agencia = agencias.find((a) => a.id === u.agenciaId)
            const sosVos = u.uid === perfil?.uid
            return (
              <li
                key={u.uid}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 transition hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-extrabold text-white uppercase ${
                      u.activo ? 'bg-coal-950' : 'bg-stone-400'
                    }`}
                  >
                    {u.nombre[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold text-stone-800">
                      {u.nombre}
                      {sosVos && (
                        <span className="ml-2 rounded-full bg-brand-100 px-2.5 py-0.5 align-middle text-sm font-bold text-brand-700">
                          vos
                        </span>
                      )}
                    </p>
                    <p className="truncate text-base text-stone-500">{u.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      u.rol === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {u.rol === 'admin' ? 'Administrador' : agencia ? `Agencia ${agencia.numero}` : 'Empleado'}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      u.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModal({ modo: 'editar', usuario: u })}
                    className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void cambiarEstado(u)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                      u.activo
                        ? 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {u.activo ? 'Deshabilitar' : 'Habilitar'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {modal && (
        <ModalUsuario
          modal={modal}
          agencias={agencias}
          onCerrar={() => setModal(null)}
          onGuardar={guardar}
        />
      )}
    </section>
  )
}

type Formulario = { nombre: string; email: string; password: string; rol: Rol; agenciaId: string }

function ModalUsuario({
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
  const editando = modal.modo === 'editar' ? modal.usuario : null
  const [nombre, setNombre] = useState(editando?.nombre ?? '')
  const [email, setEmail] = useState(editando?.email ?? '')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState<Rol>(editando?.rol ?? 'empleado')
  const [agenciaId, setAgenciaId] = useState(
    editando?.agenciaId ?? agencias[0]?.id ?? '178',
  )
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (enviando) return
    if (!nombre.trim()) return setError('Falta el nombre del usuario.')
    if (!editando) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('El correo no es válido.')
      if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    }
    if (rol === 'empleado' && !agenciaId) return setError('Elegí una agencia para el empleado.')
    setError('')
    setEnviando(true)
    onGuardar({
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      rol,
      agenciaId,
    }).finally(() => setEnviando(false))
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-stone-900/40 p-4 backdrop-blur-sm" onClick={onCerrar}>
      <form
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-scale-in sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              {editando ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">
              {editando ? editando.email : 'La cuenta tendrá acceso de inmediato.'}
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
          <Campo label="Nombre completo" htmlFor="nombre">
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="campo"
              placeholder="Ej: Ana Martínez"
              autoFocus
            />
          </Campo>

          {!editando && (
            <>
              <Campo label="Correo electrónico" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="campo"
                  placeholder="correo@agencia.com"
                />
              </Campo>
              <Campo label="Contraseña" htmlFor="password">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="campo"
                  placeholder="Mínimo 6 caracteres"
                />
              </Campo>
            </>
          )}

          <Campo label="Rol" htmlFor="rol">
            <select id="rol" value={rol} onChange={(e) => setRol(e.target.value as Rol)} className="campo">
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </Campo>

          {rol === 'empleado' && (
            <Campo label="Agencia" htmlFor="agencia">
              <select id="agencia" value={agenciaId} onChange={(e) => setAgenciaId(e.target.value)} className="campo">
                {agencias.map((a) => (
                  <option key={a.id} value={a.id}>
                    Agencia {a.numero}
                  </option>
                ))}
              </select>
            </Campo>
          )}

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
            {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear usuario'}
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

export default Usuarios