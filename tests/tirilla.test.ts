import { describe, it, expect } from 'vitest'
import {
  calcularComision,
  calcularDiferenciaTirilla,
  totalOtros,
} from '../src/utils/tirilla'

describe('cálculos de la tirilla', () => {
  it('calcula la comisión y redondea al peso', () => {
    expect(calcularComision(10000, 8)).toBe(800)
    expect(calcularComision(1234, 8)).toBe(99)
  })

  it('suma los otros conceptos', () => {
    expect(
      totalOtros([
        { concepto: 'Limpieza', importe: 500 },
        { concepto: 'Mechudo', importe: 250 },
      ]),
    ).toBe(750)
  })

  it('calcula una diferencia positiva', () => {
    expect(
      calcularDiferenciaTirilla({
        ventas: 10000,
        premios: 2000,
        caja: 3000,
        diferenciaAnterior: 0,
        comision: 800,
        otrosTotal: 200,
      }),
    ).toBe(4000)
  })

  it('calcula una diferencia negativa cuando el agenciero queda debiendo', () => {
    expect(
      calcularDiferenciaTirilla({
        ventas: 1000,
        premios: 2000,
        caja: 500,
        diferenciaAnterior: -300,
        comision: 80,
        otrosTotal: 100,
      }),
    ).toBe(-1980)
  })

  it('arrastra la diferencia del día anterior', () => {
    expect(
      calcularDiferenciaTirilla({
        ventas: 5000,
        premios: 0,
        caja: 0,
        diferenciaAnterior: 1200,
        comision: 0,
        otrosTotal: 0,
      }),
    ).toBe(6200)
  })

  it('trata valores inválidos como cero', () => {
    expect(calcularComision(Number.NaN, 8)).toBe(0)
    expect(
      calcularDiferenciaTirilla({
        ventas: Number.NaN,
        premios: 0,
        caja: 0,
        diferenciaAnterior: 0,
        comision: 0,
        otrosTotal: 0,
      }),
    ).toBe(0)
  })
})
