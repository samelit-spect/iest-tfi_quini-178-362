export type Rol = 'admin' | 'empleado'

export type TipoMovimiento = 'credito' | 'debito'

export type EstadoMovimiento = 'pendiente' | 'confirmado' | 'rechazado'

export interface Agencia {
  id: string
  numero: number
  nombre: string
}

export interface Usuario {
  uid: string
  email: string
  nombre: string
  rol: Rol
  agenciaId: string | null
  activo: boolean
}

export interface Cliente {
  id: string
  apellido: string
  nombre: string
  agenciaId: string
  creadoEl: string
}

export interface Movimiento {
  id: string
  clienteId: string
  agenciaId: string
  tipo: TipoMovimiento
  monto: number
  descripcion: string
  fecha: string
  creadoPor: string
  creadoPorNombre: string
  estado: EstadoMovimiento
  confirmadoPor?: string
  confirmadoEl?: string
  rechazadoPor?: string
  rechazadoEl?: string
}