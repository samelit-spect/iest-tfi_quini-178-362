import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Usuario } from '../types'

export async function leerPerfilUsuario(uid: string): Promise<Usuario | null> {
  const ref = doc(db, 'usuarios', uid)
  const sn = await getDoc(ref)
  if (!sn.exists()) return null
  const d = sn.data()
  return {
    uid: sn.id,
    email: d.email ?? '',
    nombre: d.nombre ?? '',
    rol: d.rol ?? 'empleado',
    agenciaId: d.agenciaId ?? null,
    activo: d.activo ?? false,
  }
}