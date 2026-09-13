import type { Movimiento, Tirilla } from '../types'

function filaCSV(celdas: (string | number | undefined)[]): string {
  return celdas
    .map((c) => {
      const s = String(c ?? '')
      return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    })
    .join(';')
}

export function descargarCSV(nombre: string, filas: (string | number | undefined)[][]) {
  const contenido = '\ufeff' + filas.map(filaCSV).join('\r\n')
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportarPlanillaCSV(nombreArchivo: string, movs: Movimiento[]) {
  const filas: (string | number | undefined)[][] = [
    ['Fecha', 'Tipo', 'Descripción', 'Importe', 'Estado'],
    ...movs
      .filter((m) => m.estado !== 'rechazado')
      .map((m) => [
        new Date(m.fecha).toLocaleDateString('es-AR'),
        m.tipo === 'credito' ? 'Crédito' : 'Débito',
        m.descripcion,
        m.tipo === 'credito' ? m.monto : -m.monto,
        m.estado === 'pendiente' ? 'Pendiente' : 'Confirmado',
      ]),
  ]
  descargarCSV(nombreArchivo, filas)
}

export function exportarTirillaCSV(
  nombreArchivo: string,
  t: Tirilla,
  otrosExtra: { concepto: string; importe: number }[] = [],
) {
  const filas: (string | number | undefined)[][] = [
    ['Concepto', 'Importe'],
    ['Total de ventas', t.ventas],
    ['Premios pagados', t.premios],
    ['Caja recibida', t.caja],
    ['Diferencia del día anterior', t.diferenciaAnterior],
    ...otrosExtra.map((o) => [o.concepto || 'Otro concepto', o.importe]),
    [`Comisión del agenciero (${t.comisionPorcentaje}%)`, t.comision],
    ['Diferencia final', t.diferencia],
  ]
  descargarCSV(nombreArchivo, filas)
}