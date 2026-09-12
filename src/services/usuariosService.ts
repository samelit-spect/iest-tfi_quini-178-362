import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Rol, Usuario } from '../types'

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

export async function listarUsuarios(): Promise<Usuario[]> {
  const snap = await getDocs(collection(db, 'usuarios'))
  return snap.docs.map((d) => {
    const x = d.data()
    return {
      uid: d.id,
      email: x.email ?? '',
      nombre: x.nombre ?? '',
      rol: (x.rol ?? 'empleado') as Rol,
      agenciaId: x.agenciaId ?? null,
      activo: x.activo ?? false,
    }
  })
}

export async function crearCuentaAuth(email: string, password: string): Promise<string> {
  const key = import.meta.env.VITE_FIREBASE_API_KEY
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  )
  const data = (await res.json()) as { localId?: string; error?: { message?: string } }
  if (!res.ok || !data.localId) {
    throw new Error(data.error?.message ?? 'UNKNOWN')
  }
  return data.localId
}

export async function crearUsuarioDoc(
  uid: string,
  datos: { email: string; nombre: string; rol: Rol; agenciaId: string | null },
): Promise<void> {
  await setDoc(doc(db, 'usuarios', uid), {
    email: datos.email,
    nombre: datos.nombre,
    rol: datos.rol,
    agenciaId: datos.agenciaId,
    activo: true,
    creadoEl: new Date().toISOString(),
  })
}

export async function actualizarUsuario(
  uid: string,
  cambios: Partial<Pick<Usuario, 'nombre' | 'rol' | 'agenciaId' | 'activo'>>,
): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), cambios)
}