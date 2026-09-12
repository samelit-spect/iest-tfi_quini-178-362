import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Cliente } from '../types'
import { normalizar } from '../utils/normalizar'

export async function buscarClientes(termino: string): Promise<Cliente[]> {
  const t = normalizar(termino)
  if (t.length < 2) return []

  const q = query(
    collection(db, 'clientes'),
    where('busqueda', '>=', t),
    where('busqueda', '<=', t + '\uf8ff'),
    orderBy('busqueda'),
    limit(8),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cliente, 'id'>) }))
}

export async function leerCliente(id: string): Promise<Cliente | null> {
  const snap = await getDoc(doc(db, 'clientes', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Cliente, 'id'>) }
}

export async function listarClientes(): Promise<Cliente[]> {
  const snap = await getDocs(collection(db, 'clientes'))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cliente, 'id'>) }))
}

export async function listarClientesPorAgencia(agenciaId: string): Promise<Cliente[]> {
  const q = query(collection(db, 'clientes'), where('agenciaId', '==', agenciaId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cliente, 'id'>) }))
}