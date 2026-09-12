import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'

const MENSAJES: Record<string, string> = {
  'auth/invalid-email': 'El correo no es válido.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/user-disabled': 'Tu cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá un momento y volvé a intentar.',
  'auth/network-request-failed': 'Problema de conexión. Revisá tu internet y volvé a intentar.',
}

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    if (enviando) return
    setError('')
    setEnviando(true)
    try {
      const perfil = await login(email.trim(), password)
      if (!perfil) {
        setError('Tu usuario no está registrado en el sistema. Pedile al administrador que lo asigne.')
        setEnviando(false)
        return
      }
      if (!perfil.activo) {
        setError('Tu cuenta está deshabilitada. Consultá con el administrador.')
        setEnviando(false)
        return
      }
      if (perfil.rol === 'empleado' && !perfil.agenciaId) {
        setError('Tu usuario todavía no tiene una agencia asignada.')
        setEnviando(false)
        return
      }
      navigate(perfil.rol === 'admin' ? '/elegir-agencia' : `/agencia/${perfil.agenciaId}`, {
        replace: true,
      })
    } catch (err: unknown) {
      const code = (err as { code?: string } | undefined)?.code ?? ''
      setError(MENSAJES[code] ?? 'No se pudo iniciar sesión. Intentalo de nuevo.')
      setEnviando(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-float" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-stone-900/10 ring-1 ring-stone-100 animate-scale-in sm:p-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-xl font-extrabold text-white shadow-lg shadow-brand-600/30 rotate-3">
            FQ
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">Iniciar sesión</h1>
            <p className="mt-1 text-base text-stone-500">
              Solo personal de las agencias. La cuenta la administra el dueño.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={entrar}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-stone-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-lg outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="usuario@agencia.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-bold text-stone-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-lg outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-base font-semibold text-brand-700 animate-fade-up">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || !email || !password}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {enviando && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-base font-semibold text-stone-500 hover:text-brand-600"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default Login