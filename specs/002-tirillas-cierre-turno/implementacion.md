# Implementación 002

## Archivos principales
- `src/pages/Tirillas.tsx`: cierre en tres columnas (movimientos del día, conceptos y totales).
- `src/services/tirillasService.ts`: guarda y consulta la colección `tirillas`; registra creador/editor.
- `src/utils/tirilla.ts`: cálculo de comisión, suma de otros conceptos y diferencia del cierre.
- `tests/tirilla.test.ts`: pruebas de comisión, otros, diferencia positiva/negativa, arrastre e inválidos.

## Flujo
1. Se eligen fecha y turno.
2. Se leen los movimientos confirmados de la agencia y se filtran por fecha.
3. Se cargan premios, caja y otros conceptos.
4. Se calcula la comisión y la diferencia.
5. Se guarda el resumen en `tirillas` con auditoría.

## Trazabilidad
- `22d86da`: tirillas de cierre de turno en tres columnas.
- `2b51bcb`: exportación a Excel/PDF de planillas y tirillas.
- `dd68dce` y `a2e7e65`: tests de cálculo y extracción de la fórmula a `src/utils/tirilla.ts`.

## Validación
`npm test` en verde (13/13). Detalle en `verificacion.md`.
