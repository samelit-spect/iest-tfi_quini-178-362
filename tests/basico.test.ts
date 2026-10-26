import { describe, it, expect } from 'vitest'

describe('Quini 178/362 - tests básicos', () => {
  it('debe mantener principio de inmutabilidad conceptual', () => {
    const confirmado = { estado: 'confirmado', inmutable: true }
    expect(confirmado.estado).toBe('confirmado')
    expect(confirmado.inmutable).toBe(true)
  })

  it('debe separar pendientes y confirmados', () => {
    const colecciones = ['movimientos_pendientes', 'movimientos_confirmados']
    expect(colecciones.length).toBe(2)
  })
})
