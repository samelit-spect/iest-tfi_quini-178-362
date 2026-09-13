export type Rol = 'admin' | 'empleado'

export type TipoMovimiento = 'credito' | 'debito'

export type EstadoMovimiento = 'pendiente' | 'confirmado' | 'rechazado'

export type TurnoTirilla = 'manana' | 'tarde'

export interface Agencia {
  id: string
  numero: number
  nombre: string
  comisionPorcentaje?: number
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
  busqueda?: string
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
  creadoEl: string
  estado: EstadoMovimiento
  editadoPor?: string
  editadoPorNombre?: string
  editadoEl?: string
  confirmadoPor?: string
  confirmadoPorNombre?: string
  confirmadoEl?: string
  rechazadoPor?: string
  rechazadoPorNombre?: string
  rechazadoEl?: string
}

export interface ConceptoOtro {
  concepto: string
  importe: number
}

export interface Tirilla {
  id: string
  agenciaId: string
  fecha: string
  turno: TurnoTirilla
  ventas: number
  premios: number
  caja: number
  diferenciaAnterior: number
  otros: ConceptoOtro[]
  comisionPorcentaje: number
  comision: number
  diferencia: number
  creadoPor: string
  creadoPorNombre: string
  creadoEl: string
  editadoPor?: string
  editadoPorNombre?: string
  editadoEl?: string
}