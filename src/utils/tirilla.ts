import type { ConceptoOtro } from '../types'

function numero(valor: unknown): number {
  const n = Number(valor)
  return Number.isFinite(n) ? n : 0
}

export function calcularComision(ventas: number, porcentaje: number): number {
  return Math.round(numero(ventas) * numero(porcentaje) / 100)
}

export function totalOtros(otros: ConceptoOtro[]): number {
  return otros.reduce((total, concepto) => total + numero(concepto.importe), 0)
}

export function calcularDiferenciaTirilla(datos: {
  ventas: number
  premios: number
  caja: number
  diferenciaAnterior: number
  comision: number
  otrosTotal: number
}): number {
  return (
    numero(datos.ventas) -
    numero(datos.premios) -
    numero(datos.caja) +
    numero(datos.diferenciaAnterior) -
    numero(datos.comision) -
    numero(datos.otrosTotal)
  )
}
