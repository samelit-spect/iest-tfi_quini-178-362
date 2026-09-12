import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
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