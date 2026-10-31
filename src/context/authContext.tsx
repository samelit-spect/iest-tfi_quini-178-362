import { useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { Usuario } from '../types'
import { AuthCtx, type EstadoAuth } from './auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioFire, setUsuarioFire] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [estado, setEstado] = useState<EstadoAuth>('cargando')

  useEffect(() => {
    let activo = true
    let arrancado = false
    let unsubscribe: (() => void) | undefined
    let temporizador: number | undefined
    const eventos = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const

    const limpiarDisparadores = () => {
      if (temporizador !== undefined) window.clearTimeout(temporizador)
      eventos.forEach((evento) => window.removeEventListener(evento, iniciar))
    }

    const iniciar = () => {
      if (arrancado || !activo) return
      arrancado = true
      limpiarDisparadores()
      void (async () => {
        const [{ onAuthStateChanged }, { auth }] = await Promise.all([
          import('firebase/auth'),
          import('../services/firebase'),
        ])
        if (!activo) return

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!activo) return
          setUsuarioFire(user)
          if (!user) {
            setPerfil(null)
            setEstado('anonimo')
            return
          }
          const { leerPerfilUsuario } = await import('../services/usuariosService')
          const p = await leerPerfilUsuario(user.uid)
          if (!activo) return
          setPerfil(p)
          setEstado('logueado')
        })
      })()
    }

    const ruta = window.location.pathname
    const requiereSesion =
      ruta.startsWith('/admin') ||
      ruta.startsWith('/agencia') ||
      ruta === '/elegir-agencia' ||
      ruta === '/login'

    if (requiereSesion) {
      iniciar()
    } else {
      eventos.forEach((evento) =>
        window.addEventListener(evento, iniciar, { once: true, passive: true }),
      )
      temporizador = window.setTimeout(iniciar, 5000)
    }

    return () => {
      activo = false
      limpiarDisparadores()
      unsubscribe?.()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const [{ signInWithEmailAndPassword }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('../services/firebase'),
    ])
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const { leerPerfilUsuario } = await import('../services/usuariosService')
    const p = await leerPerfilUsuario(cred.user.uid)
    setPerfil(p)
    setEstado('logueado')
    return p
  }

  const logout = async () => {
    const [{ signOut }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('../services/firebase'),
    ])
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