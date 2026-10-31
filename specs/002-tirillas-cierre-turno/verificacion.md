# Verificación 002

## Checklist contra spec
- [x] UCF-010: la tirilla carga créditos y débitos de movimientos confirmados del día por agencia (`leerMovimientosConfirmadosPorAgencia` + filtro por fecha en `Tirillas.tsx`).
- [x] UCF-011: permite agregar conceptos de cierre (premios, caja y otros) con importes.
- [x] UCF-012: calcula la comisión sobre las ventas con porcentaje configurable por el admin (`calcularComision` + `actualizarComisionPorcentaje`).
- [x] UCF-013: arrastra la diferencia del último cierre de la misma agencia (`leerUltimaTirilla`).
- [x] UCF-014: muestra total de ventas, comisión y diferencia para cuadrar.
- [x] UCF-015: registra auditoría al crear (`creadoPor`, `creadoPorNombre`, `creadoEl`) y al editar (`editadoPor`, `editadoPorNombre`, `editadoEl`).
- [x] URN-010: guardar la tirilla no modifica saldos de clientes.
- [x] Solo lee movimientos confirmados.
- [x] No toca `movimientos_pendientes` ni `movimientos_confirmados`.
- [x] Diferencia del día anterior arrastrada correctamente.
- [x] Auditoría presente.

## Resultado
Estado: Verificado

## Evidencia
- `src/pages/Tirillas.tsx`: carga solo `leerMovimientosConfirmadosPorAgencia`, filtra por fecha, calcula los totales y guarda el cierre.
- `src/services/tirillasService.ts`: escribe únicamente en la colección `tirillas`.
- `src/utils/tirilla.ts`: fórmula `ventas - premios - caja + diferenciaAnterior - comisión - otros`.
- `tests/tirilla.test.ts`: 6 tests de comisión, otros conceptos, diferencia positiva/negativa, arrastre y valores inválidos.
- `npm test`: 3 archivos, 13/13 tests OK.
