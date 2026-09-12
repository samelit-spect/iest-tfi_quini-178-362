import { useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from '../services/firebase'
import { leerPerfilUsuario } from '../services/usuariosService'
import type { Usuario } from '../types'
import { AuthCtx, type EstadoAuth } from './auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioFire, setUsuarioFire] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [estado, setEstado] = useState<EstadoAuth>('cargando')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuarioFire(user)
      if (!user) {
        setPerfil(null)
        setEstado('anonimo')
        return
      }
      const p = await leerPerfilUsuario(user.uid)
      setPerfil(p)
      setEstado('logueado')
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const p = await leerPerfilUsuario(cred.user.uid)
    setPerfil(p)
    setEstado('logueado')
    return p
  }

  const logout = async () => {
    await signOut(auth)
    setPerfil(null)
    setEstado('anonimo')
  }

  const inicioPorRol =
    perfil === null
      ? null
      : perfil.rol === 'admin'
        ? '/elegir-agencia'
        : `/agencia/${perfil.agenciaId}`

  return (
    <AuthCtx.Provider value={{ estado, usuarioFire, perfil, login, logout, inicioPorRol }}>
      {children}
    </AuthCtx.Provider>
  )
}