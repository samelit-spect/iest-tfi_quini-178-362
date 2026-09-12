# PLAN - Fichas de Quiniela Digitales

> Documento vivo de planificación y decisiones del proyecto. Mantener actualizado en cada sesión para no quedar "al aire".

## 1. Idea en una línea

Digitalizar las fichas en papel de las agencias de quiniela: el empleado carga créditos y débitos de cada cliente, el administrador los confirma (quedando bloqueados e inmutables) y cada cliente puede ver su planilla sin registrarse.

## 2. Actores y roles

| Rol | Cantidad | Características |
|-----|----------|-----------------|
| Administrador | 1 (el dueño; puede compartir el rol con otra persona) | No atado a una agencia. Controla las 2 agencias. Usuarios, planillas, confirmaciones. |
| Empleado | 2 por agencia (total 4) | Atado a SU agencia. Carga movimientos y puede corregirlos mientras están pendientes. |
| Cliente | Público | Sin registro. Solo lectura de su planilla (historial + saldo). |

## 3. Reglas de negocio clave

1. **No hay registro desde la web.** Los usuarios los crea, habilita/deshabilita y modifica el administrador desde su panel.
2. **El empleado está atado a su agencia.** Al iniciar sesión entra directo a su agencia; nunca ve la otra.
3. **El admin NO está atado.** Al iniciar sesión elige agencia (178 o 362), **sin contraseña** (esa vista solo la ve el admin).
4. **No hay contraseña de agencia** en el flujo (se descartó: con el login de Firebase alcanza).
5. **Movimiento = fecha + descripción + monto + tipo (crédito/débito).**
6. Un movimiento nuevo nace en estado **pendiente**. El empleado que lo cargó puede **modificarlo o eliminarlo** hasta que el admin lo confirme.
7. **El admin confirma o rechaza** los pendientes.
8. Al confirmar, el movimiento **se mueve de la estructura de "pendientes" a la de "confirmados"** en Firestore y queda **inmutable para siempre** (nadie lo modifica ni elimina).
9. **Corrección de errores:** si un movimiento confirmado está mal (p. ej. se puso 2000 y eran 1800), NO se toca el original: el empleado carga un **nuevo movimiento** con descripción tipo *"Corrección: ..."* que pasa por el mismo flujo de confirmación.
10. **Vista pública del cliente:** buscar por apellido y nombre, sin distinguir mayúsculas/minúsculas, solo lectura.

## 4. Recorrido del usuario (flujo navegable)

```
HOME (público)
├── Buscar planilla por apellido y nombre (solo lectura)
└── [Iniciar sesión] → LOGIN (Firebase Auth, sin registro)

LOGIN OK
├── EMPLEADO (atado a su agencia)
│   └── Redirige directo a la vista de SU agencia
└── ADMIN (no atado)
    └── [Agencia 178] / [Agencia 362]   (sin contraseña)
        └── Vista de la agencia elegida

VISTA DE AGENCIA → menú según rol (la opción PLANILLAS está en ambos)
└── PLANILLAS
    └── Elegir cliente (búsqueda por apellido y nombre, sin mayúsculas)
        └── FICHA DEL CLIENTE
            ├── Ver historial + saldo actual
            ├── SUMAR / RESTAR (fecha + descripción + monto)
            │   └──⇒ movimiento PENDIENTE (el registro original NO cambia)
            └── Corregir pendientes propios (editar / eliminar)

ADMIN → Panel de confirmación: CONFIRMAR / RECHAZAR pendientes
    └── Confirmado ⇒ pasa a la estructura CONFIRMADOS ⇒ inmutable
```

## 5. Modelo de datos preliminar (Firebase Firestore)

Dos estructuras separadas para movimientos (decisión acordada):

| Colección | Uso |
|-----------|-----|
| `usuarios` | Cuentas de admin y empleados (creadas por el admin) con su rol y agencia |
| `agencias` | Las 2 agencias (nombre, nº) |
| `clientes` | Fichas de clientes: apellido, nombre, agencia |
| `movimientos_pendientes` | Movimientos sin confirmar (editables/eliminables) |
| `movimientos_confirmados` | Movimientos confirmados (inmutables) |

Los movimientos confirmados se pueden recuperar por cliente para mostrar el historial + saldo en la vista pública.

## 6. Tecnología

- **Frontend:** React + TypeScript + Vite + Tailwind CSS (web responsive).
- **Backend:** Firebase Auth (login) + Firestore (datos).
- **Despliegue:** Firebase Hosting (gratuito).
- Compatible con la Etapa 3 (diseño) que vendrá.

## 7. Funciones adicionales (pendientes de definir)

- El usuario mencionó que la gestión de planillas es "una de las funciones" del proyecto: quedan por definir otras funciones en próximas sesiones.

## 8. Estado del entorno (2026-09-12)

- App React + Vite + TS creada en la **raíz** del repo. Tailwind v4, React Router y Firebase instalados.
- `src/types/index.ts` con los tipos de dominio.
- `src/services/firebase.ts` listo; `.env` vacío → **hay que completar las claves del proyecto Firebase**.
- Git inicializado (main) con primer commit.
- Pendientes: crear proyecto Firebase (+ Auth email y Firestore), crear colecciones y conectar GitHub.

## 9. Próximos pasos

- [ ] Completar claves de Firebase en `.env` y crear colecciones en Firestore.
- [ ] Conectar repo GitHub (remote origin + push).
- [ ] Wireframes de las pantallas (Etapa 1).
- [ ] Etapa 2: metodología de desarrollo.
- [ ] Definir funciones adicionales del proyecto.