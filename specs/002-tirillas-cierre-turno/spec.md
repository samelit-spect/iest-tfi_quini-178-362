# Spec 002 - Tirillas (cierre de turno)

## Objetivo
Digitalizar cierre de turno por fecha/turno/agencia. Resumen, no modifica saldos de clientes.

## Requerimientos EARS
- UCF-010: WHEN se crea tirilla, THE SISTEMA SHALL cargar créditos/débitos de movimientos CONFIRMADOS del día por agencia.
- UCF-011: THE SISTEMA SHALL permitir agregar conceptos de cierre (premios, caja, otros) con importes.
- UCF-012: THE SISTEMA SHALL calcular comisión del agenciero sobre total de ventas con porcentaje configurable por admin.
- UCF-013: THE SISTEMA SHALL arrastrar diferencia del día anterior de la misma agencia.
- UCF-014: THE SISTEMA SHALL mostrar total de ventas, comisión, diferencia para cuadrar.
- UCF-015: THE SISTEMA SHALL registrar auditoría (creadoPor/creadoEn) y permitir corrección por admin.
- URN-010: THE SISTEMA SHALL NO modificar saldos de clientes al guardar tirilla.

## Criterios
- [x] Solo lee confirmados
- [x] No toca movimientos_pendientes/confirmados
- [x] Diferencia arrastrada correcta
- [x] Auditoría
