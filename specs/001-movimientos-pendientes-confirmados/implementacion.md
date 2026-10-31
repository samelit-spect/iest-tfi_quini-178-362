# Implementación 001

## Archivos principales
- `src/types/index.ts`: tipos `Movimiento`, `Cliente` y `Usuario`.
- `src/services/movimientosService.ts`: alta, edición y baja de pendientes; confirmación y rechazo con auditoría; lectura de confirmados por cliente y agencia.
- `src/pages/FichaCliente.tsx`: carga de créditos/débitos y lista de pendientes del cliente.
- `src/pages/admin/Planillas.tsx`: confirmación y rechazo desde el panel.
- `src/pages/PlanillaPublica.tsx`: vista pública que lee solo `movimientos_confirmados`.
- `firestore.rules`: separación de colecciones, permisos por rol e inmutabilidad de confirmados.

## Trazabilidad
- `28efa1d`: módulo de planillas con pendientes editables.
- `f4e5c28` y `b54a6bb`: tabla de pendientes y confirmación desde el panel.
- `9e67d8a`: auditoría de movimientos.
- `19870cf`, `cfe1dd9` y `b94533f`: reglas de Firestore y consultas alineadas por rol/agencia.
- `4356250`: tests base de inmutabilidad y separación de colecciones.

## Validación
Build, lint y `npm test` en verde (13/13). Detalle en `verificacion.md`.
