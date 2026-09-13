import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from './firebase'
import type { ConceptoOtro, Tirilla, TurnoTirilla } from '../types'

interface DatosTirilla {
  agenciaId: string
  fecha: string
  turno: TurnoTirilla
  ventas: number
  premios: number
  caja: number
  diferenciaAnterior: number
  otros: ConceptoOtro[]
  comisionPorcentaje: number
  comision: number
  diferencia: number
  creador: { uid: string; nombre: string }
}

function mapear(docs: { id: string; data: () => Record<string, unknown> }[]): Tirilla[] {
  return docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tirilla, 'id'>) }))
}

export async function leerTirilla(
  agenciaId: string,
  fecha: string,
  turno: TurnoTirilla,
): Promise<Tirilla | null> {
  const q = query(
    collection(db, 'tirillas'),
    where('agenciaId', '==', agenciaId),
    where('fecha', '==', fecha),
    where('turno', '==', turno),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return mapear(snap.docs)[0]
}

export async function guardarTirilla(datos: DatosTirilla, idExistente: string | null) {
  const base = {
    agenciaId: datos.agenciaId,
    fecha: datos.fecha,
    turno: datos.turno,
    ventas: datos.ventas,
    premios: datos.premios,
    caja: datos.caja,
    diferenciaAnterior: datos.diferenciaAnterior,
    otros: datos.otros,
    comisionPorcentaje: datos.comisionPorcentaje,
    comision: datos.comision,
    diferencia: datos.diferencia,
  }
  if (idExistente) {
    await updateDoc(doc(db, 'tirillas', idExistente), {
      ...base,
      editadoPor: datos.creador.uid,
      editadoPorNombre: datos.creador.nombre,
      editadoEl: new Date().toISOString(),
    })
  } else {
    await addDoc(collection(db, 'tirillas'), {
      ...base,
      creadoPor: datos.creador.uid,
      creadoPorNombre: datos.creador.nombre,
      creadoEl: new Date().toISOString(),
    })
  }
}

export async function listarTirillas(agenciaId: string): Promise<Tirilla[]> {
  const q = query(collection(db, 'tirillas'), where('agenciaId', '==', agenciaId))
  const snap = await getDocs(q)
  return mapear(snap.docs).sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha < b.fecha ? 1 : -1
    if (a.turno !== b.turno) return a.turno === 'tarde' ? -1 : 1
    return 0
  })
}

export async function leerUltimaTirilla(agenciaId: string): Promise<Tirilla | null> {
  const todas = await listarTirillas(agenciaId)
  return todas[0] ?? null
}