import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firestore'
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

export async function crearCliente(datos: { apellido: string; nombre: string; agenciaId: string }) {
  await addDoc(collection(db, 'clientes'), {
    apellido: datos.apellido,
    nombre: datos.nombre,
    agenciaId: datos.agenciaId,
    busqueda: normalizar(`${datos.apellido} ${datos.nombre}`),
    creadoEl: new Date().toISOString(),
  })
}

export async function actualizarCliente(
  id: string,
  datos: { apellido: string; nombre: string; agenciaId: string },
) {
  await updateDoc(doc(db, 'clientes', id), {
    apellido: datos.apellido,
    nombre: datos.nombre,
    agenciaId: datos.agenciaId,
    busqueda: normalizar(`${datos.apellido} ${datos.nombre}`),
  })
}

export async function eliminarCliente(id: string, agenciaId: string) {
  const [pendientes, confirmados] = await Promise.all([
    getDocs(
      query(
        collection(db, 'movimientos_pendientes'),
        where('clienteId', '==', id),
        where('agenciaId', '==', agenciaId),
      ),
    ),
    getDocs(query(collection(db, 'movimientos_confirmados'), where('clienteId', '==', id))),
  ])

  if (!pendientes.empty || !confirmados.empty) {
    throw new Error('CLIENTE_CON_MOVIMIENTOS')
  }

  await deleteDoc(doc(db, 'clientes', id))
}