import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'
import type { Usuario } from '../types'

export type EstadoAuth = 'cargando' | 'logueado' | 'anonimo'

export interface AuthContexto {
  estado: EstadoAuth
  usuarioFire: User | null
  perfil: Usuario | null
  login: (email: string, password: string) => Promise<Usuario | null>
  logout: () => Promise<void>
  inicioPorRol: string | null
}

export const AuthCtx = createContext<AuthContexto | null>(null)

export function useAuth(): AuthContexto {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}