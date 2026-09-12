import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center text-2xl font-extrabold text-stone-900">
          Iniciar sesión
        </h1>
        <p className="mb-6 text-center text-sm text-stone-500">
          Solo personal de las agencias. La cuenta la administra el dueño.
        </p>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Entrar
          </button>
        </form>

        <Link
          to="/"
          className="mt-4 block text-center text-sm text-stone-500 hover:text-brand-600"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default Login