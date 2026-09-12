import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Movimiento } from '../types'

export async function leerMovimientosConfirmados(clienteId: string): Promise<Movimiento[]> {
  const q = query(
    collection(db, 'movimientos_confirmados'),
    where('clienteId', '==', clienteId),
    orderBy('fecha', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Movimiento, 'id'>) }))
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
  const q = query(
    collection(db, 'movimientos_pendientes'),
    where('estado', '==', 'pendiente'),
    orderBy('fecha', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Movimiento, 'id'>) }))
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