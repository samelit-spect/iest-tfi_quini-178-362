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
11. **Accesibilidad:** la mayoría de los usuarios son personas mayores → textos grandes y legibles, alto contraste, controles y botones amplios, navegación simple (aplica a todo el sistema).
12. **Tirilla (cierre de turno):** por fecha y turno (mañana/tarde), por agencia. La parte superior toma los créditos y débitos del día (nombre del cliente + importe) de los **movimientos confirmados**; debajo van los conceptos del cierre (premios, caja, diferencia del día anterior y "otros" variados —limpieza, etc.—, varios por tirilla). Al pie: **total de ventas + comisión del agenciero + diferencia** (lo que falta para cuadrar). Es solo resumen: **no modifica los saldos** de los clientes.
13. **Comisión del agenciero:** porcentaje fijo que define el administrador (se calcula solo sobre el total de ventas de la tirilla).
14. **Diferencia del día anterior:** se arrastra automáticamente desde el cierre previo de la agencia en la nueva tirilla.
15. **Quién la controla:** el agenciero carga su cierre de turno; el administrador lo ve, lo corrige y audita el histórico por agencia.

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
- **Despliegue:** Netlify (build `npm run build`, publish `dist`, reglas SPA en `netlify.toml`). URL: https://gleeful-beignet-736b8f.netlify.app/
- Compatible con la Etapa 3 (diseño) que vendrá.

## 7. Funciones adicionales (decididas el 2026-09-13)

- **Cierre de turno (tirillas)**: digitaliza la tirilla del agenciero (ver reglas 12–15).
- **Dashboard del admin**: pendientes por confirmar, saldos por agencia y movimientos del día.
- **Auditoría**: quién y cuándo creó/corrigió/confirmó cada movimiento y tirilla.
- **Exportación**: planillas, tirillas y reportes a Excel/PDF.
- Notificaciones al cliente quedaron en "Could Have" (pendientes de decidir).

## 8. Estado del entorno (2026-09-12)

- App React + Vite + TS creada en la **raíz** del repo. Tailwind v4, React Router y Firebase instalados.
- `src/types/index.ts` con los tipos de dominio; `src/services/firebase.ts` con claves en `.env`.
- Firebase activo (project `fichas-quiniela`, Auth email + Firestore) y repositorio en GitHub (`samelit-spect/fichas-quiniela`).
- **Desplegado en Netlify** (public view funcionando; fix de deploy con `netlify.toml`).
- **Vista pública construida:** búsqueda predictiva + planilla animada del cliente (con datos demo de prueba en Firestore: Pérez Juan, González María, Pérez Ana, Díaz Roberto). El sito ya funcionando en Netlify.
- Lint (`oxlint`) y build OK.

## 9. Próximos pasos

- [x] Login real (AuthContext) y redirección por rol.
- [x] Panel de administración (usuarios, planillas, confirmaciones).
- [x] Definir funciones adicionales del proyecto (tirillas, dashboard, auditoría, exportación).
- [ ] Implementar dashboard del admin (saldos, pendientes, movimientos del día).
- [x] Lista de módulos de la agencia: Planillas + Tirillas (desde la vista de agencia, pestañas).
- [x] Implementar tirillas (cierre de turno del agenciero) — 3 columnas: clientes del día / conceptos / cierre.
- [x] Exportación a Excel/PDF (planillas y tirillas) — botones 📥 Excel (CSV) y 🖨️ PDF (impresión limpia).
- [x] Auditoría de movimientos (quién/cuándo cargó, editó, confirmó y rechazó). Las tirillas llevarán la misma traza cuando se construyan.
- [x] Reglas de seguridad de Firestore en fase intermedia (`firestore.rules`): login para escribir y datos internos; lectura pública para planillas y agencias. Endurecer por rol al cierre.
- [ ] Probar el flujo completo en Netlify con empleados creados desde el panel.
- [ ] Etapa 2: metodología de desarrollo.
- [ ] Pendiente de validar: fórmula exacta de total/comisión/diferencia de la tirilla con el dueño al construirla.