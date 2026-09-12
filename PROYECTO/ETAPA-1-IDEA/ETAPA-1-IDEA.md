# ETAPA 1 - Idea del Proyecto: Fichas de Quiniela Digitales

## 1. Idea del proyecto

**Fichas de Quiniela Digitales** es un sistema web que digitaliza las fichas en papel que hoy se usan en las agencias de quiniela para registrar los créditos y débitos de cada cliente. El empleado de la agencia registra los movimientos en la ficha del cliente, el administrador (dueño) los revisa y confirma para que queden bloqueados e inmutables, y el cliente puede consultar en cualquier momento su planilla completa (historial de movimientos y saldo actual) **sin necesidad de registrarse**.

El sistema maneja **dos agencias**, cada una con sus propios clientes y sus **2 empleados**. El administrador tiene control total sobre ambas agencias y puede compartir su rol con otra persona (por ejemplo, el dueño del negocio).

## 2. Recopilación de información

- **Situación actual:** cada agencia lleva una carpeta con fichas de papel. Cada ficha contiene únicamente el nombre del cliente y sus créditos y débitos.
- **Problemas detectados:**
  - Las fichas en papel se pueden perder, ensuciar o deteriorar.
  - No existe historial: no se sabe cuándo ni quién registró cada crédito o débito.
  - Los movimientos se pueden alterar o tachar sin dejar rastro.
  - El cliente tiene que ir presencialmente a la agencia para consultar su saldo.
  - No hay forma de que el administrador controle qué carga cada empleado.
- **Solución:** un sistema web donde el empleado carga los movimientos, el administrador los confirma (quedando inmutables) y el cliente consulta su planilla desde cualquier dispositivo sin registrarse.

## 3. Recorrido del usuario

```
HOME (público)
├── Buscar planilla por apellido y nombre (solo lectura)
└── [Iniciar sesión] → LOGIN (Firebase Auth, sin registro)

LOGIN OK
├── EMPLEADO (cuenta atada a SU agencia)
│   └── Entra directo a la vista de su agencia
└── ADMIN (cuenta no atada)
    └── [Agencia 178] / [Agencia 362] (sin contraseña; solo la ve el admin)

VISTA DE AGENCIA → menú según rol (planillas disponible para ambos)
└── PLANILLAS
    └── Elegir cliente (búsqueda por apellido y nombre)
        └── FICHA DEL CLIENTE
            ├── Ver historial + saldo actual
            ├── SUMAR / RESTAR (fecha + descripción + monto) → PENDIENTE
            └── Modificar/eliminar movimientos propios mientras estén pendientes

ADMIN → Panel: CONFIRMAR / RECHAZAR pendientes
    └── Confirmado ⇒ pasa a la estructura de confirmados ⇒ inmutable
```

## 4. Objetivos

### General
Desarrollar un sistema web que digitalice las fichas de clientes de las agencias de quiniela, garantizando el control del administrador sobre cada movimiento registrado por sus empleados.

### Específicos
- Registrar clientes por agencia con apellido y nombre.
- Permitir al empleado cargar movimientos de crédito y débito con fecha, concepto y monto.
- Permitir al administrador confirmar o rechazar los movimientos pendientes.
- Bloquear los movimientos confirmados para que nadie pueda modificarlos después.
- Permitir a cada cliente consultar su planilla (historial + saldo) sin iniciar sesión.
- Gestionar 2 agencias, con 2 empleados cada una y control centralizado del administrador.

## 5. Alcance del sistema (in / out)

### Dentro del alcance
- Fichas de clientes por agencia (apellido y nombre).
- Registro de movimientos (crédito / débito) por el empleado con fecha, descripción y monto.
- Confirmación (y rechazo) de movimientos por el administrador.
- Bloqueo de movimientos confirmados: pasan a una estructura de "confirmados" y no se modifican ni eliminan.
- Edición/eliminación de movimientos pendientes por parte de quien los cargó, hasta que el admin los confirme.
- Corrección de errores mediante un nuevo movimiento con descripción "Corrección", sin tocar el original.
- Vista pública de la planilla del cliente por apellido y nombre, sin registro.
- Búsqueda insensible a mayúsculas y minúsculas.
- Empleados atados a su agencia (sin opción de entrar a la otra) y administrador con acceso a ambas.
- Autenticación y roles: administrador y empleado (usuarios creados por el admin, sin registro público).
- Dos agencias con sus respectivos empleados.
- Historial de movimientos y saldo actual por cliente.

### Fuera del alcance (primera versión)
- Aplicación móvil nativa (el sistema es web responsive, funciona bien en el celular).
- Pagos o cobros en línea.
- Más de dos agencias.
- Notificaciones automáticas (email/SMS) al cliente.
- Exportación de reportes (se evaluará en etapas posteriores).

## 6. Requerimientos funcionales

| ID | Requerimiento |
|----|---------------|
| RF-01 | El sistema debe permitir registrar clientes con apellido y nombre y asignarlos a una agencia. |
| RF-02 | El sistema debe permitir al empleado cargar movimientos de crédito o débito con fecha, descripción y monto en la ficha de un cliente. |
| RF-03 | Los movimientos cargados deben quedar en estado "pendiente" y poder modificarse o eliminarse por quien los cargó hasta que el administrador los confirme. |
| RF-04 | El sistema debe permitir al administrador confirmar o rechazar movimientos pendientes. |
| RF-05 | Al confirmar un movimiento, el sistema debe moverlo a la estructura de "confirmados", donde no podrá modificarse ni eliminarse por ningún usuario. |
| RF-06 | El sistema debe permitir al cliente ver su planilla (historial y saldo) sin iniciar sesión. |
| RF-07 | La búsqueda de la planilla del cliente debe funcionar por apellido y nombre, ignorando mayúsculas y minúsculas. |
| RF-08 | Cada empleado debe estar atado a su agencia: al iniciar sesión entra directo a ella y no puede ver operar la otra. El administrador, en cambio, debe poder elegir la agencia al ingresar. |
| RF-09 | El sistema debe permitir al administrador crear, modificar y deshabilitar usuarios (admin y empleados) desde un panel. |
| RF-10 | El sistema debe mostrar al administrador un resumen de movimientos pendientes de confirmar y reportes de saldos. |
| RF-11 | El sistema debe permitir cargar un movimiento de "corrección" (con su descripción) para arreglar errores, que pasa por el mismo flujo de confirmación y nunca modifica el movimiento original. |

## 7. Requerimientos no funcionales

| ID | Requerimiento |
|----|---------------|
| RNF-01 | El sistema debe ser responsive (funcionar en celular, tablet y escritorio). |
| RNF-02 | La planilla del cliente y el registro de movimientos deben cargar en menos de 3 segundos. |
| RNF-03 | El acceso debe ser seguro: autenticación y reglas de seguridad por rol en Firebase. |
| RNF-04 | La interfaz debe seguir buenas prácticas de UX/UI (navegación clara y accesible). |
| RNF-05 | El código debe ser mantenible (TypeScript, componentes reutilizables y documentación). |
| RNF-06 | El sistema debe poder desplegarse de forma gratuita (Firebase Hosting). |

## 8. Priorización de características (MoSCoW)

### Must Have (imprescindibles)
- Registro de clientes por agencia.
- Carga de movimientos (crédito/débito) por el empleado.
- Confirmación y bloqueo de movimientos por el administrador.
- Autenticación con roles (admin y empleado).
- Vista pública de la planilla del cliente sin registro (solo lectura).

### Should Have (importantes)
- Historial de movimientos y saldo actual.
- Búsqueda sin distinguir mayúsculas de minúsculas.
- Dos agencias con sus empleados.
- Panel de administración con pendientes de confirmar y reportes.

### Could Have (deseables)
- Registro de auditoría (quién y cuándo cargó cada movimiento).
- Notificaciones al cliente.
- Exportación de planillas y reportes.

### Won't Have (excluidos esta versión)
- Aplicación móvil nativa.
- Pagos en línea.
- Más de dos agencias.

## 9. Relato de los requerimientos y la solución

Carlos, empleado de la agencia del centro, recibe a un cliente que quiere cargar un crédito. Abre el sistema, busca la ficha del cliente por apellido y nombre y registra el movimiento: "Crédito — $5.000, cliente saldó parte de su deuda". El movimiento queda en "pendiente" y al instante aparece en el panel del administrador.

María, la administradora (dueña), revisa los movimientos pendientes de sus dos agencias cada noche. Ve el crédito que cargó Carlos, está correcto, y lo **confirma**. A partir de ese momento el movimiento queda **bloqueado**: ya no se puede modificar ni borrar, evitando errores o alteraciones posteriores. Si algo está mal, lo rechaza y el empleado lo puede corregir.

El cliente, desde su celular, entra a la vista pública (sin crear cuenta), escribe su apellido y nombre, y ve su planilla completa: el historial de cada crédito y débito con su fecha y concepto, y su saldo actual. Solo lectura: no puede modificar nada, solo ver.

De esta manera, se elimina la carpeta de papel, se registra el historial completo de cada cliente, el administrador mantiene el control total y el cliente consulta su saldo sin depender de ir presencialmente a la agencia.