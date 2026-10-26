import { Link } from 'react-router-dom'
import { LeyendaIA } from './LeyendaIA'

export function PiePublico() {
  return (
    <footer className="mx-auto flex w-full max-w-3xl flex-col items-center gap-1.5 px-5 py-8 text-center text-sm font-semibold text-stone-500 sm:px-10">
      <Link
        to="/como-hicimos"
        className="font-bold text-brand-700 transition hover:text-brand-800"
      >
        Cómo hicimos este sitio
      </Link>
      <p>Quini 178/362 · Agencias 178 y 362 · Trabajo Final Integrador IES Tinogasta</p>
      <LeyendaIA />
    </footer>
  )
}
