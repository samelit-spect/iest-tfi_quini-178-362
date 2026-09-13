import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Movimiento, TipoMovimiento } from '../types'

function ordenarPorFechaDesc(a: Movimiento, b: Movimiento) {
  return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
}

function mapear(docs: { id: string; data: () => Record<string, unknown> }[]): Movimiento[] {
  return docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Movimiento, 'id'>) }))
}

export async function leerMovimientosConfirmados(clienteId: string): Promise<Movimiento[]> {
  const q = query(collection(db, 'movimientos_confirmados'), where('clienteId', '==', clienteId))
  const snap = await getDocs(q)
  return mapear(snap.docs).sort(ordenarPorFechaDesc)
}

export async function leerAgencia(id: string) {
  const snap = await getDoc(doc(db, 'agencias', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as { numero: number; nombre: string }) }
}

export async function listarAgencias() {
  const snap = await getDocs(collection(db, 'agencias'))
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as { numero: number; nombre: string }),
  }))
}

export async function listarPendientes(): Promise<Movimiento[]> {
  const q = query(collection(db, 'movimientos_pendientes'), where('estado', '==', 'pendiente'))
  const snap = await getDocs(q)
  return mapear(snap.docs).sort(ordenarPorFechaDesc)
}

export async function confirmarMovimiento(m: Movimiento, adminUid: string, adminNombre: string) {
  await runTransaction(db, async (tx) => {
    const ref = doc(db, 'movimientos_pendientes', m.id)
    const sn = await tx.get(ref)
    if (!sn.exists()) return
    const d = sn.data()
    await tx.set(doc(collection(db, 'movimientos_confirmados')), {
      ...d,
      estado: 'confirmado',
      confirmadoPor: adminUid,
      confirmadoPorNombre: adminNombre || d.creadoPorNombre,
      confirmadoEl: new Date().toISOString(),
    })
    await tx.delete(ref)
  })
}

export async function rechazarMovimiento(m: Movimiento, adminUid: string, adminNombre: string) {
  await updateDoc(doc(db, 'movimientos_pendientes', m.id), {
    estado: 'rechazado',
    rechazadoPor: adminUid,
    rechazadoPorNombre: adminNombre,
    rechazadoEl: new Date().toISOString(),
  })
}

export async function listarPendientesPorCliente(clienteId: string): Promise<Movimiento[]> {
  const q = query(collection(db, 'movimientos_pendientes'), where('clienteId', '==', clienteId))
  const snap = await getDocs(q)
  return mapear(snap.docs)
    .filter((m) => m.estado === 'pendiente')
    .sort(ordenarPorFechaDesc)
}

export async function crearMovimientoPendiente(datos: {
  clienteId: string
  agenciaId: string
  tipo: TipoMovimiento
  monto: number
  descripcion: string
  fecha: string
  creadoPor: string
  creadoPorNombre: string
}) {
  await addDoc(collection(db, 'movimientos_pendientes'), {
    ...datos,
    estado: 'pendiente',
    creadoEl: new Date().toISOString(),
  })
}

export async function actualizarMovimientoPendiente(
  id: string,
  cambios: Partial<Pick<Movimiento, 'tipo' | 'monto' | 'descripcion' | 'fecha'>>,
  editor?: { uid: string; nombre: string },
) {
  const aGuardar = editor
    ? {
        ...cambios,
        editadoPor: editor.uid,
        editadoPorNombre: editor.nombre,
        editadoEl: new Date().toISOString(),
      }
    : cambios
  await updateDoc(doc(db, 'movimientos_pendientes', id), aGuardar)
}

export async function eliminarMovimientoPendiente(id: string) {
  await deleteDoc(doc(db, 'movimientos_pendientes', id))
}

export async function listarPendientesPorAgencia(agenciaId: string): Promise<Movimiento[]> {
  const q = query(
    collection(db, 'movimientos_pendientes'),
    where('agenciaId', '==', agenciaId),
    where('estado', '==', 'pendiente'),
  )
  const snap = await getDocs(q)
  return mapear(snap.docs).sort(ordenarPorFechaDesc)
}

export async function leerMovimientosConfirmadosPorAgencia(agenciaId: string): Promise<Movimiento[]> {
  const q = query(collection(db, 'movimientos_confirmados'), where('agenciaId', '==', agenciaId))
  const snap = await getDocs(q)
  return mapear(snap.docs).sort(ordenarPorFechaDesc)
}