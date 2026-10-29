import { describe, it, expect } from 'vitest'
import { normalizar } from '../src/utils/normalizar'

describe('normalización de búsqueda', () => {
  it('ignora mayúsculas', () => {
    expect(normalizar('PÉREZ')).toBe('perez')
  })

  it('quita tildes y diéresis', () => {
    expect(normalizar('María José Güemes')).toBe('maria jose guemes')
  })

  it('convierte la eñe en ene', () => {
    expect(normalizar('Ñandú')).toBe('nandu')
  })

  it('recorta espacios al inicio y al final', () => {
    expect(normalizar('  Pérez  ')).toBe('perez')
  })

  it('mantiene el espacio entre apellido y nombre', () => {
    expect(normalizar('Pérez Juan')).toBe('perez juan')
  })
})
