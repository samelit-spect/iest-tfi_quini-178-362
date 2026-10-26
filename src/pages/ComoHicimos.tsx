import { Link } from 'react-router-dom'
import { LeyendaIA } from '../components/LeyendaIA'
import { PiePublico } from '../components/PiePublico'

const PIEZAS = [
  'Imágenes fotorrealistas del local, los servicios y los mockups',
  'Video promocional con clips generados por IA',
  'Video demo del sistema funcionando',
  'Infografía del ciclo SDD y gráficos con datos reales del proyecto',
]

function ComoHicimos() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-6 sm:px-10">
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

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 py-4 sm:px-10">
        <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
          Cómo hicimos este sitio
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Quini 178/362 es un sistema para digitalizar las fichas de las agencias de
          quiniela 178 y 362. Lo desarrollamos con IA como herramienta asistiva,
          siguiendo el ciclo de Desarrollo Guiado por Especificaciones (SDD): primero
          la especificación, después el código, y siempre con revisión humana.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-stone-100">
            <h2 className="text-lg font-extrabold text-stone-900">Especificar antes de programar</h2>
            <p className="mt-2 text-base leading-relaxed text-stone-600">
              Cada funcionalidad tiene su especificación en notación EARS, su
              clarificación, su plan, sus tareas y su verificación. La IA propuso
              el código; una persona lo leyó, lo entendió y lo aprobó.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-stone-100">
            <h2 className="text-lg font-extrabold text-stone-900">Reglas que no se negocian</h2>
            <p className="mt-2 text-base leading-relaxed text-stone-600">
              Los movimientos confirmados son inmutables. Un error se corrige con un
              movimiento nuevo, no editando el anterior. El cliente consulta su
              planilla sin registrarse y la tirilla no modifica saldos.
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-lg shadow-stone-900/5 ring-1 ring-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-stone-900">Piezas generadas con IA</h2>
            <LeyendaIA />
          </div>
          <p className="mt-2 text-base leading-relaxed text-stone-600">
            Las piezas visuales y audiovisuales del proyecto se generaron con IA y
            se identifican como tales:
          </p>
          <ul className="mt-3 grid gap-2 text-base text-stone-700 sm:grid-cols-2">
            {PIEZAS.map((pieza) => (
              <li key={pieza} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>{pieza}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-stone-500">
            Cada pieza tiene su ficha en <code>multimedia/FICHAS-IA.md</code> con la
            herramienta, el prompt final, las iteraciones, la edición humana y la
            licencia.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-lg shadow-stone-900/5 ring-1 ring-stone-100">
          <h2 className="text-lg font-extrabold text-stone-900">Uso responsable</h2>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-stone-600">
            <li>No usamos imágenes ni voces de personas reales sin consentimiento.</li>
            <li>No imitamos marcas, logos ni el estilo de artistas con nombre propio.</li>
            <li>No pegamos datos personales, contraseñas ni claves en los prompts.</li>
            <li>Revisamos las imágenes de personas para evitar estereotipos.</li>
            <li>Leemos y entendemos todo el código antes de aceptarlo.</li>
            <li>Registramos cuántas piezas generamos y cuántas usamos.</li>
          </ul>
        </section>

        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <p className="text-base font-semibold text-brand-800">
            Este sitio y sus piezas multimedia fueron generados con IA como parte del
            Trabajo Final Integrador de la carrera Tec. en Desarrollo de Software del
            IES Tinogasta. La IA es una herramienta: el criterio, la ética y las
            decisiones son humanas.
          </p>
        </div>
      </main>

      <PiePublico />
    </div>
  )
}

export default ComoHicimos
