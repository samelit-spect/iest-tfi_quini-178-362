import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/auth'

const INACTIVIDAD_MS = 30 * 60 * 1000
const AVISO_SEGUNDOS = 60

function VigilanteSesion() {
  const { estado, logout } = useAuth()
  const [avisoAbierto, setAvisoAbierto] = useState(false)
  const [segundos, setSegundos] = useState(AVISO_SEGUNDOS)
  const timerRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const limpiarTemporizadores = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const arrancarAviso = useCallback(() => {
    setSegundos(AVISO_SEGUNDOS)
    setAvisoAbierto(true)
    intervalRef.current = window.setInterval(() => {
      setSegundos((s) => s - 1)
    }, 1000)
  }, [])

  const cerrarPorInactividad = useCallback(async () => {
    setAvisoAbierto(false)
    limpiarTemporizadores()
    await logout()
  }, [logout, limpiarTemporizadores])

  const reiniciarSesion = useCallback(() => {
    setAvisoAbierto(false)
    limpiarTemporizadores()
    timerRef.current = window.setTimeout(arrancarAviso, INACTIVIDAD_MS)
  }, [arrancarAviso, limpiarTemporizadores])

  useEffect(() => {
    if (estado !== 'logueado') {
      setAvisoAbierto(false)
      limpiarTemporizadores()
      return
    }

    timerRef.current = window.setTimeout(arrancarAviso, INACTIVIDAD_MS)

    const ACTIVIDAD = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const
    let throttle = false
    const detectar = () => {
      if (throttle) return
      throttle = true
      window.setTimeout(() => {
        throttle = false
      }, 1000)
      reiniciarSesion()
    }
    ACTIVIDAD.forEach((e) => window.addEventListener(e, detectar, { passive: true }))

    return () => {
      ACTIVIDAD.forEach((e) => window.removeEventListener(e, detectar))
      limpiarTemporizadores()
    }
  }, [estado, arrancarAviso, reiniciarSesion, limpiarTemporizadores])

  useEffect(() => {
    if (avisoAbierto && segundos <= 0) {
      void cerrarPorInactividad()
    }
  }, [avisoAbierto, segundos, cerrarPorInactividad])

  if (!avisoAbierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Sesión por inactividad"
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl animate-scale-in"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-3xl">
          ⏰
        </div>
        <h2 className="mt-4 text-lg font-extrabold text-stone-900">Sesión por inactividad</h2>
        <p className="mt-1 text-sm font-medium text-stone-500">
          Por seguridad, tu sesión se cerrará en{' '}
          <span className="font-extrabold text-stone-800">{Math.max(segundos, 0)} segundos</span>
          .
        </p>
        <button
          type="button"
          onClick={reiniciarSesion}
          className="mt-5 w-full rounded-xl bg-coal-950 px-4 py-3 text-base font-extrabold text-white transition hover:bg-coal-800"
        >
          Seguir conectado
        </button>
      </div>
    </div>
  )
}

export default VigilanteSesion