# 02 — Requerimientos

## Requerimientos funcionales (RF)

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-01 | Registrar clientes con apellido y nombre y asignarlos a una agencia. | Must |
| RF-02 | Cargar movimientos de crédito o débito con fecha, descripción y monto en la ficha del cliente. | Must |
| RF-03 | Los movimientos cargados quedan en estado **pendiente** y pueden editarse o eliminarse por quien los cargó. | Must |
| RF-04 | El administrador puede **confirmar o rechazar** los movimientos pendientes. | Must |
| RF-05 | Al confirmar, el movimiento pasa a la estructura de **confirmados** y queda inmutable. | Must |
| RF-06 | El cliente puede ver su planilla (historial y saldo) **sin iniciar sesión**. | Must |
| RF-07 | La búsqueda funciona por apellido y nombre, sin distinguir mayúsculas ni acentos. | Should |
| RF-08 | El empleado queda atado a su agencia; el admin elige agencia al ingresar. | Must |
| RF-09 | El administrador crea, modifica y habilita/deshabilita usuarios desde un panel. | Must |
| RF-10 | El administrador ve un dashboard con pendientes, saldos por agencia y movimientos del día. | Should |
| RF-11 | Cargar un movimiento de «Corrección» que pasa por el mismo flujo sin tocar el original. | Should |
| RF-12 | Cargar el cierre de turno (**tirilla**) con ventas, premios, caja, diferencia anterior, «otros», comisión y diferencia. | Should |
| RF-13 | Registrar auditoría: quién y cuándo creó, editó, confirmó o rechazó cada movimiento y tirilla. | Should |
| RF-14 | Exportar planillas, tirillas y reportes de saldos a Excel o PDF. | Could |

## Requerimientos no funcionales (RNF)

- **RNF-01 Responsive:** debe funcionar en celular, tablet y escritorio.
- **RNF-02 Rendimiento:** planilla y registros cargan en menos de 3 segundos.
- **RNF-03 Seguridad:** autenticación y reglas de seguridad por rol.
- **RNF-04 Accesibilidad:** textos grandes, alto contraste y controles amplios (público mayor).
- **RNF-05 Mantenibilidad:** TypeScript, componentes reutilizables y documentación.
- **RNF-06 Despliegue:** publicación gratuita en Netlify con SPA.

## Priorización (MoSCoW)

| Nivel | Requerimientos |
|-------|----------------|
| Must Have | RF-01 a RF-06, RF-08, RF-09 |
| Should Have | RF-07, RF-10, RF-11, RF-12, RF-13 |
| Could Have | RF-14 (y notificaciones al cliente, no incluidas) |
| Won't Have | App nativa, pagos en línea, +2 agencias |

## Reglas de negocio clave

1. No hay registro público: los usuarios los crea el administrador.
2. Un movimiento nuevo nace **pendiente**.
3. Al confirmar se mueve a `movimientos_confirmados` y queda **inmutable**.
4. Un error en un movimiento confirmado se corrige con un **movimiento nuevo**.
5. La tirilla es solo un resumen: **no modifica los saldos** de los clientes.

## Historias de usuario y criterios de aceptación

### HU-01 — El cliente consulta su planilla sin registrarse

> Como cliente, quiero ver mi planilla con apellido y nombre para conocer
> mi saldo sin ir al mostrador ni crearme una cuenta.

Criterios de aceptación:

- La búsqueda encuentra la ficha sin distinguir mayúsculas ni acentos.
- La planilla muestra historial (fecha, concepto, monto) y el **saldo actual**.
- Es de **solo lectura**: no hay botones para cargar ni editar movimientos.
- Una persona distinta puede ver su planilla con la misma sesión abierta.

### HU-02 — El empleado carga un movimiento y el admin lo confirma

> Como empleado, quiero cargar créditos y débitos en la ficha del cliente
> para que quedé un registro de lo que apostó y pagó.

Criterios de aceptación:

- Tras guardar, el movimiento aparece en **pendientes** con estado visible.
- Quien lo cargó puede editarlo o eliminarlo **antes** de la confirmación.
- El admin puede confirmar o rechazar; al confirmar pasa a `movimientos_confirmados` e **inmutable**.
- En el historial del cliente se distingue «Pendiente» de «Confirmado».
