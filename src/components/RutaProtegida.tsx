import type { ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth'

export function RutaProtegida({ children }: { children: ReactNode }) {
  const { estado, perfil, logout } = useAuth()

  if (estado === 'cargando') {
    return (
      <div className="grid min-h-svh place-items-center bg-cream-100">
        <div className="skeleton h-14 w-72 rounded-2xl" />
      </div>
    )
  }

  if (estado === 'anonimo') return <Navigate to="/login" replace />

  if (!perfil || !perfil.activo) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="text-2xl font-extrabold text-stone-900">Sin acceso</h1>
        <p className="max-w-sm text-base text-stone-600">
          Tu cuenta está deshabilitada o no fue cargada en el sistema. Consultá
          con el administrador.
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700"
        >
          Entrar con otra cuenta
        </button>
        <Link to="/" className="text-sm font-semibold text-stone-500 hover:text-brand-600">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (perfil.rol === 'empleado' && !perfil.agenciaId) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">🏪</span>
        <h1 className="text-2xl font-extrabold text-stone-900">Sin agencia asignada</h1>
        <p className="max-w-sm text-base text-stone-600">
          Tu usuario todavía no tiene una agencia asignada. Pedile al
          administrador que la configure.
        </p>
        <Link to="/" className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-700">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return <>{children}</>
}