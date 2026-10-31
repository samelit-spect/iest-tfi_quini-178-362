# Cambio 002

## Problema detectado
La IA propuso modificar los saldos de los clientes al guardar la tirilla. La tirilla es solo un resumen de cierre y no debe alterar el historial.

## Corrección aplicada
- La tirilla lee únicamente movimientos confirmados.
- Al guardar, escribe solo en la colección `tirillas`.
- No actualiza clientes, `movimientos_pendientes` ni `movimientos_confirmados`.

## Evidencia
- `src/services/tirillasService.ts`: todas las escrituras apuntan a `tirillas`.
- `src/pages/Tirillas.tsx`: usa `leerMovimientosConfirmadosPorAgencia`.
- `tests/tirilla.test.ts`: valida la fórmula sin tocar saldos.
- Registro del error en `docs/PROMPTS.md` y `docs/SESION-ERRORES-IA.md` (caso 3).
