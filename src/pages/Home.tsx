import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-xs font-bold tracking-[0.3em] text-brand-600 uppercase">
        Agencias 178 y 362
      </p>
      <h1 className="max-w-2xl text-4xl font-extrabold text-stone-900 sm:text-5xl">
        Fichas de Quiniela Digitales
      </h1>
      <p className="max-w-md text-stone-500">
        Consultá tu planilla de créditos y débitos por apellido y nombre, sin
        registrarte.
      </p>

      <div className="w-full max-w-sm">
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Buscar por apellido y nombre"
            className="field"
          />
          <button
            type="button"
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Buscar
          </button>
        </div>
      </div>

      <Link
        to="/login"
        className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-brand-300 hover:text-brand-600"
      >
        Iniciar sesión
      </Link>
    </div>
  )
}

export default Home