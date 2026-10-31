# Spec 001 - Movimientos pendientes/confirmados

## Objetivo
Digitalizar la carga de créditos/débitos por cliente, con flujo de aprobación del administrador. Los movimientos confirmados deben ser inmutables.

## Constitución aplicable
Ver `docs/CONSTITUCION.md`. Respeta identidad, español, seguridad, inmutabilidad.

## Requerimientos con notación EARS

### Funcionales
- UCF-001: WHEN un empleado logueado carga un movimiento (fecha, descripción, monto, tipo crédito/débito) para un cliente de su agencia, THE SISTEMA SHALL crearlo en `movimientos_pendientes` con estado `pendiente`.
- UCF-002: WHILE un movimiento esté en `movimientos_pendientes` y fue creado por el empleado de esa agencia, THE SISTEMA SHALL permitir editarlo o eliminarlo.
- UCF-003: WHEN el administrador visualiza la lista de pendientes (filtrable por agencia), THE SISTEMA SHALL mostrar cliente, fecha, descripción, monto, tipo, agencia, creador.
- UCF-004: WHEN el administrador confirma un movimiento pendiente, THE SISTEMA SHALL moverlo a `movimientos_confirmados` con metadatos de auditoría (confirmadoPor, confirmadoEn) y ELIMINARLO de `movimientos_pendientes`. El movimiento confirmado SHALL ser inmutable.
- UCF-005: WHEN el administrador rechaza un movimiento pendiente, THE SISTEMA SHALL eliminarlo de `movimientos_pendientes` registrando auditoría (rechazadoPor, rechazadoEn, motivo).
- UCF-006: WHEN hay un error en un movimiento ya confirmado, THE SISTEMA SHALL permitir cargar un NUEVO movimiento corrector (con descripción "Corrección: ...") que siga el mismo flujo pendiente -> confirmación. NO SHALL modificarse el movimiento confirmado.
- UCF-007: WHERE el cliente consulta su planilla pública, THE SISTEMA SHALL mostrar únicamente movimientos de `movimientos_confirmados` calculando saldo con créditos/débitos.

### No funcionales
- URN-001: THE SISTEMA SHALL mantener separadas las colecciones `movimientos_pendientes` y `movimientos_confirmados`.
- URN-002: THE SISTEMA SHALL impedir modificar/eliminar documentos en `movimientos_confirmados` desde cualquier rol.
- URN-003: THE SISTEMA SHALL aplicar reglas por rol en Firestore.
- URN-004: THE SISTEMA SHALL ser accesible (textos grandes, alto contraste).

## Criterios de aceptación
- [x] Se crea en pendientes al cargar
- [x] Editable/eliminable solo mientras pendiente y por contexto correcto
- [x] Confirmación mueve a confirmados e inmutable
- [x] Rechazo elimina con auditoría
- [x] Corrección es un nuevo movimiento
- [x] Vista pública lee solo confirmados
