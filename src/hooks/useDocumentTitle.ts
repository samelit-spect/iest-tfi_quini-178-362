import { useEffect } from 'react'

const TITULO_BASE = 'Quini 178/362 · Fichas digitalizadas'
const DESCRIPCION_BASE =
  'Consultá en línea los créditos y débitos de tu ficha en la agencia de quiniela. Buscá tu planilla con apellido y nombre, sin registrarte.'

function actualizarDescripcion(texto: string) {
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', texto)
}

export function useDocumentTitle(titulo: string, descripcion?: string) {
  useEffect(() => {
    document.title = titulo
    if (descripcion) actualizarDescripcion(descripcion)
    return () => {
      document.title = TITULO_BASE
      actualizarDescripcion(DESCRIPCION_BASE)
    }
  }, [titulo, descripcion])
}
