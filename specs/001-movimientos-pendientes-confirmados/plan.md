# Plan 001

## Arquitectura
- Tipos: `src/types/movimiento.ts` (Pendiente/Confirmado)
- Servicios: `src/services/movimientos.ts` (crear/enviar/editar/eliminar pendientes, confirmar/rechazar)
- Contexto/Auth: respetar rol/agencia
- Componentes/Páginas: FichaCliente, panel admin para confirmaciones

## Pasos
1. Definir tipos
2. Servicios Firestore para pendientes/confirmados
3. UI carga movimiento en FichaCliente
4. Panel de confirmaciones (admin)
5. Reglas Firestore
6. Vista pública solo confirmados
7. Pruebas manuales

## Riesgos
- Mover entre colecciones -> hacerlo con cuidado y auditoría
- Evitar edición directa de confirmados

## Validación
- /verificar contra spec
