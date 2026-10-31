# Cambio 001

## Problema detectado
La IA propuso permitir editar un movimiento ya confirmado. Eso rompe la regla de inmutabilidad del historial.

## Corrección aplicada
- Los movimientos confirmados no se editan ni se eliminan.
- Una corrección se carga como un nuevo movimiento que vuelve a pasar por `pendiente -> confirmado`.
- Se mantienen dos colecciones separadas y se registra auditoría de cada paso.

## Evidencia
- `src/services/movimientosService.ts`: no expone edición ni borrado de confirmados.
- `firestore.rules`: `update` y `delete` bloqueados en `movimientos_confirmados`.
- `tests/basico.test.ts`: cubre la separación de colecciones y la inmutabilidad conceptual.
- Registro del error en `docs/PROMPTS.md` y `docs/SESION-ERRORES-IA.md` (caso 1).
