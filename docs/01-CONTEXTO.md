# 01 — Contexto

## Problema

Hoy cada agencia de quiniela lleva las cuentas de sus clientes en
**fichas de papel**. Eso trae varios problemas:

- Las fichas se pierden, se ensucian o se deterioran.
- No hay historial: no se sabe **quién** ni **cuándo** cargó cada movimiento.
- Los importes se pueden alterar o tachar sin dejar rastro.
- El cliente debe ir **presencialmente** para consultar su saldo.
- El dueño no puede controlar qué carga cada empleado.

## Objetivo

Desarrollar un sistema web que digitalice las fichas de los clientes de
las agencias de quiniela, garantizando que el **administrador confirme
cada movimiento** y que los movimientos confirmados queden inmutables.

## Público destinatario

| Actor | Cantidad | Qué hace |
|-------|----------|----------|
| Administrador (el dueño) | 1 (puede compartir el rol) | Controla las 2 agencias, usuarios y confirmaciones |
| Empleado / agenciero | 2 por agencia (4 en total) | Carga movimientos y su cierre de turno |
| Cliente | Público | Consulta su planilla sin registrarse (solo lectura) |

Nota: la mayoría de los usuarios son **personas mayores**, así que todo
el sistema debe ser grande, legible y fácil de usar.

## Productos o servicios

- **Panel de administración:** usuarios, clientes, confirmaciones, dashboard.
- **Módulo Planillas:** carga de créditos y débitos por cliente.
- **Módulo Tirillas:** cierre de turno (mañana/tarde) del agenciero.
- **Vista pública:** consulta de la planilla del cliente sin registro.
- **Exportación** de planillas y tirillas a Excel/PDF.

## Propuesta de valor

Reemplaza la carpeta de papel con una **planilla digital con historial**,
controlada por el dueño y consultable por el cliente en cualquier
momento, con una interfaz pensada para personas mayores.

## Alcance

### Dentro del alcance

- Registro de clientes por agencia (apellido y nombre).
- Movimientos de crédito/débito con fecha, descripción y monto.
- Confirmación y rechazo por el administrador; bloqueo al confirmar.
- Corrección de errores mediante un nuevo movimiento «Corrección».
- Vista pública de la planilla (solo lectura).
- Autenticación con roles admin/empleado y 2 agencias.
- Cierre de turno (tirilla) con comisión del agenciero.
- Dashboard, auditoría y exportación a Excel/PDF.

### No incluye (por ahora)

- Aplicación móvil nativa (el sistema es web responsive).
- Pagos o cobros en línea.
- Más de dos agencias.
- Notificaciones automáticas (email/SMS) al cliente.
- Firma digital o comprobantes legales.
