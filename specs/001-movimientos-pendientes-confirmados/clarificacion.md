# Clarificación 001

## Dudas identificadas
- ¿Puede el empleado corregir un pendiente ajeno? -> NO. Solo el propio o según lógica de agencia.
- ¿Se permite borrar desde UI confirmados? -> NO. Completamente prohibido.
- ¿Cómo se calcula el saldo público? -> Suma créditos - débitos de confirmados por cliente/agencia.

## Decisiones
- Dos colecciones separadas obligatorias.
- Al confirmar: copiar a confirmados + borrar de pendientes (transaccional cuando sea posible).
- Auditoría mínima: creadoPor/creadoEn, confirmadoPor/confirmadoEn o rechazadoPor/rechazadoEn.
- Corrección = nuevo movimiento, nunca editar confirmado.

## Estado
- [x] Clarificado
