import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import {
  listarAgencias,
  leerAgencia,
  listarPendientesPorAgencia,
  leerMovimientosConfirmadosPorAgencia,
} from '../../services/movimientosService'
import { listarClientesPorAgencia } from '../../services/clientesService'
import { formatoPesos } from '../../utils/format'
import type { Agencia } from '../../types'

interface AgenciaResumen {
  agencia: Agencia
  clientes: number
  pendientes: number
  montoPendientes: number
  creditosHoy: number
  debitosHoy: number
  saldoNeto: number
}

function Dashboard() {
  const { perfil } = useAuth()
  const [hoy] = useState(() => new Date().toISOString().slice(0, 10))
  const [datos, setDatos] = useState<AgenciaResumen[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    async function cargar() {
      try {
        let agencias: Agencia[]
        if (perfil?.rol === 'admin') {
          agencias = await listarAgencias()
        } else {
          const agenciaId = perfil?.agenciaId
          const ag = agenciaId ? await leerAgencia(agenciaId) : null
          agencias = ag ? [ag] : []
        }

        const resultados = await Promise.all(
          agencias.map(async (ag) => {
            const [clientes, pendientes, confirmados] = await Promise.all([
              listarClientesPorAgencia(ag.id),
              listarPendientesPorAgencia(ag.id),
              leerMovimientosConfirmadosPorAgencia(ag.id),
            ])

            const confirmadosHoy = confirmados.filter((c) => c.fecha === hoy)
            const creditosHoy = confirmadosHoy
              .filter((c) => c.tipo === 'credito')
              .reduce((s, m) => s + m.monto, 0)
            const debitosHoy = confirmadosHoy
              .filter((c) => c.tipo === 'debito')
              .reduce((s, m) => s + m.monto, 0)
            const saldoNeto = confirmados.reduce(
              (s, m) => s + (m.tipo === 'credito' ? m.monto : -m.monto),
              0,
            )
            const montoPendientes = pendientes.reduce(
              (s, m) => s + (m.tipo === 'credito' ? m.monto : -m.monto),
              0,
            )

            return {
              agencia: ag,
              clientes: clientes.length,
              pendientes: pendientes.length,
              montoPendientes,
              creditosHoy,
              debitosHoy,
              saldoNeto,
            }
          }),
        )
        if (activo) setDatos(resultados)
      } finally {
        if (activo) setCargando(false)
      }
    }
    void cargar()
    return () => {
      activo = false
    }
  }, [perfil?.rol, perfil?.agenciaId, hoy])

  return (
    <section>
      <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
        {perfil?.rol === 'admin' ? 'Resumen general' : 'Resumen de la agencia'}
      </h1>
      <p className="mt-2 font-medium text-stone-500">
        Estado de las agencias, pendientes y movimientos del día.
      </p>

      {cargando ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 animate-fade-up sm:grid-cols-2">
          {datos.map((d) => (
            <div
              key={d.agencia.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 transition hover:shadow-md sm:p-6"
            >
              <h3 className="text-lg font-extrabold text-stone-900">
                Agencia {d.agencia.numero}
                <span className="ml-2 text-sm font-semibold text-stone-500">
                  · {d.agencia.nombre}
                </span>
              </h3>

              <dl className="mt-4 space-y-3 text-sm font-medium">
                <div className="flex items-center justify-between">
                  <dt className="text-stone-600">Clientes</dt>
                  <dd className="font-bold text-stone-900">{d.clientes}</dd>
                </div>

                <div className="flex items-center justify-between text-amber-700">
                  <dt>Pendientes sin confirmar</dt>
                  <dd className="font-bold">
                    {d.pendientes}{' '}
                    <span className="text-xs opacity-80">
                      ({formatoPesos.format(d.montoPendientes)})
                    </span>
                  </dd>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <dt className="text-stone-600">Movimientos de hoy</dt>
                  <dd className="font-bold">
                    <span className="text-green-600">+{formatoPesos.format(d.creditosHoy)}</span>
                    <span className="mx-1 text-stone-300">/</span>
                    <span className="text-rose-600">−{formatoPesos.format(d.debitosHoy)}</span>
                  </dd>
                </div>

                <div className="h-px bg-stone-100" aria-hidden="true" />

                <div className="flex items-center justify-between text-base font-extrabold text-stone-900">
                  <dt>Saldo neto total</dt>
                  <dd>{formatoPesos.format(d.saldoNeto)}</dd>
                </div>
              </dl>

              <Link
                to={`/agencia/${d.agencia.id}`}
                className="mt-5 block w-full rounded-xl bg-stone-900 py-2.5 text-center text-sm font-bold text-white transition hover:bg-stone-700"
              >
                Abrir planillas
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Dashboard