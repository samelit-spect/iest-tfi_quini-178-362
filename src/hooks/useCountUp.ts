import { useEffect, useState } from 'react'

export function useCountUp(target: number, duracion = 900): number {
  const [valor, setValor] = useState(0)

  useEffect(() => {
    let raf: number
    const inicio = performance.now()

    const tick = (t: number) => {
      const progreso = Math.min((t - inicio) / duracion, 1)
      const eased = 1 - Math.pow(1 - progreso, 3)
      setValor(target * eased)
      if (progreso < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duracion])

  return valor
}