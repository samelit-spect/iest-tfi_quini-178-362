# Verificación 001

## Checklist contra spec
- [x] UCF-001..007 cubiertos
- [x] URN-001..004 cumplidos
- [x] Dos colecciones separadas (`movimientos_pendientes` / `movimientos_confirmados`)
- [x] Confirmados inmutables (sin update/delete desde reglas)
- [x] Auditoría presente (quién/cuándo)
- [x] Corrección es nuevo movimiento

## Resultado
Estado: Verificado

## Evidencia
- Código en `src/services/movimientosService.ts`, `src/pages/FichaCliente.tsx`, `src/pages/PlanillaPublica.tsx`
- Reglas `firestore.rules`
- Build/lint/tests OK (13 tests)
- Commits trazables

