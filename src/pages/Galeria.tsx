import { Link } from 'react-router-dom'
import { LeyendaIA } from '../components/LeyendaIA'
import { PiePublico } from '../components/PiePublico'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const PIEZAS = [
  { src: '/media/IMG-001-hero-portada.jpg', alt: 'Agencia de quiniela Quini 178/362 en Tinogasta, generado con IA' },
  { src: '/media/IMG-002-local-agencia.jpg', alt: 'Interior de agencia de quiniela en Tinogasta, generado con IA' },
  { src: '/media/IMG-003-fichas-digitales.jpg', alt: 'Planilla digital de Quini 178/362, generado con IA' },
  { src: '/media/IMG-004-persona-uso.jpg', alt: 'Persona ficticia consultando planilla pública, generado con IA' },
]

function Galeria() {
  useDocumentTitle('Galería multimedia · Quini 178/362')

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-6 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/marca/isotipo-quini.svg"
            alt="Isotipo de Quini 178/362"
            className="h-11 w-11 rounded-xl shadow-lg shadow-brand-600/20"
          />
          <div className="leading-tight">
            <p className="text-base font-extrabold text-stone-900">Quini 178/362</p>
            <p className="text-sm font-semibold text-stone-500">Fichas digitalizadas</p>
          </div>
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-stone-300 bg-white/70 px-4 py-2 text-sm font-bold text-stone-700 backdrop-blur transition hover:border-brand-300 hover:text-brand-600"
        >
          Volver al inicio
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 py-4 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">Galería multimedia</h1>
            <p className="mt-2 text-lg text-stone-600">
              Piezas generadas con IA para el Trabajo Final Integrador. Todas identificadas como tales.
            </p>
          </div>
          <LeyendaIA />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PIEZAS.map((pieza, i) => (
            <figure
              key={pieza.src}
              className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-stone-900/5 ring-1 ring-stone-100 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={pieza.src}
                alt={pieza.alt}
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
              <figcaption className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-stone-500">
                <span>Fotografía fotorrealista · Tinogasta</span>
                <LeyendaIA />
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <p className="text-base font-semibold text-brand-800">
            Las piezas se generaron con Ideogram (versión gratuita), siguiendo el principio de uso
            responsable. Las fichas completas están en <code>multimedia/FICHAS-IA.md</code>.
          </p>
        </div>
      </main>

      <PiePublico />
    </div>
  )
}

export default Galeria
