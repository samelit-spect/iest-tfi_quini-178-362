# Implementación 003

## Archivos principales
- `src/pages/admin/Dashboard.tsx`: tarjetas por agencia con clientes, pendientes, movimientos del día y saldo neto.
- `src/pages/admin/Admin.tsx`: layout y control de acceso del panel.
- `src/components/RutaProtegida.tsx`: exige sesión activa y perfil habilitado.
- `src/services/movimientosService.ts`: `listarAgencias`, `listarPendientesPorAgencia` y `leerMovimientosConfirmadosPorAgencia`.
- `src/services/clientesService.ts`: clientes por agencia.

## Trazabilidad
- `fad5e82`: dashboard del admin con saldos por agencia, pendientes y movimientos del día.
- `d1b4e44`: documentación del dashboard en contexto.
- `b6d65fc`: login con roles y rutas protegidas.
- `9e67d8a`: auditoría de movimientos usada en los resúmenes.

## Validación
Build, lint y `npm test` en verde (13/13). Detalle en `verificacion.md`.
