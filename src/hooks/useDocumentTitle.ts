import { useEffect } from 'react'

const TITULO_BASE = 'Quini 178/362 · Fichas digitalizadas'

export function useDocumentTitle(titulo: string) {
  useEffect(() => {
    document.title = titulo
    return () => {
      document.title = TITULO_BASE
    }
  }, [titulo])
}
