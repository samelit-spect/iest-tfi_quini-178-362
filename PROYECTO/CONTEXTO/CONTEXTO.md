# Contexto del Proyecto

> Registro continuo de todo lo que hacemos en el proyecto. Actualizar después de cada sesión de trabajo.

## 2026-09-12 - Reinicio del proyecto

### Decisión
- Se descartó la idea original de una tienda en línea con dropshipping (no era lo más práctico).
- Se eliminó toda la documentación de ese proyecto (ETAPA-1..3 y el registro anterior).
- Se definirá un nuevo tipo de proyecto para el seminario.

### Qué se hizo
- `ETAPA-1-IDEA/` eliminada por completo (incluidos los wireframes de la tienda).
- `ETAPA-2-METODOLOGIA/` y `ETAPA-3-DISENO/` quedaron vacías (documentación eliminada).
- `CONTEXTO.md` reiniciado desde cero.
- `DOCUMENTACION/` se conserva intacta: es el material de la cátedra a seguir.

## 2026-09-12 - Nuevo proyecto definido: Fichas de Quiniela Digitales

### Decisión
- El proyecto reemplaza las fichas en papel de las agencias de quiniela por un sistema web.
- El empleado carga créditos/débitos, el administrador los confirma (quedan inmutables) y el cliente ve su planilla sin registrarse.
- Dos agencias, 2 empleados por agencia, control centralizado del dueño (admin).

### Qué se hizo
- Creada `ETAPA-1-IDEA/ETAPA-1-IDEA.md` con la documentación completa: idea, objetivos, alcance, 10 requerimientos funcionales, 6 no funcionales, MoSCoW y relato de la solución.
- Generado `ETAPA-1-IDEA.docx` con pandoc.
- Decisiones: planilla = historial de movimientos + saldo actual; identificación del cliente por apellido y nombre; stack React + Firebase (gratuito).

## 2026-09-12 - Flujo navegable y reglas definidas

### Qué se acordó
- **No hay registro en la web:** los usuarios los crea/deshabilita/modifica el admin desde su panel.
- **Empleado atado a su agencia:** al iniciar sesión entra directo; no puede ver la otra agencia.
- **Admin no atado:** al iniciar sesión elige agencia (178 o 362), **sin contraseña**.
- **Se descartó la contraseña de agencia** en código: con el login de Firebase alcanza.
- **Movimiento = fecha + descripción + monto + tipo (crédito/débito).**
- Movimiento nuevo nace **pendiente**; quien lo cargó puede **editar/eliminarlo** hasta que el admin confirme.
- **Firestore con 2 estructuras**: `movimientos_pendientes` y `movimientos_confirmados`. Al confirmar, el movimiento pasa a confirmados y queda **inmutable**.
- **Corrección de errores:** si un confirmado está mal, se carga un **nuevo movimiento** con descripción "Corrección: ..." que pasa por el mismo flujo. El original nunca se modifica.
- **Vista pública del cliente:** por apellido y nombre, sin distinguir mayúsculas, solo lectura.

### Qué se hizo
- Creado `PROYECTO/PLAN.md` con el recorrido navegable, roles, reglas de negocio, modelo de datos preliminar (colecciones Firestore) y próximos pasos.
- `ETAPA-1-IDEA.md` actualizada y `ETAPA-1-IDEA.docx` regenerado: se agregó la sección "Recorrido del usuario", se actualizaron RF-02/03/05/08/09 y se añadió RF-11 (corrección).

## 2026-09-12 - Puesta a punto del entorno

### Qué se hizo
- Proyecto **React + TypeScript + Vite** creado en la **raíz** del repo (código en la raíz, `PROYECTO/` = documentación).
- Instalados: Tailwind CSS v4 (+ plugin en `vite.config.ts`), React Router DOM y Firebase.
- Tema base en `index.css` (paleta brand roja "quiniela" + crema), fuente Nunito.
- Páginas base: `Home` (con buscador público de planilla y botón iniciar sesión) y `Login` (placeholder sin lógica).
- `src/types/index.ts`: tipos de dominio (Agencia, Usuario, Cliente, Movimiento).
- `src/services/firebase.ts`: configuración de Firebase leyendo variables de entorno.
- `.env.example` creado; `.env` copiado (vacío, ignorado por git). **Faltan las claves reales.**
- Git inicializado (`-b main`) + primer commit. NOTA: Git ignora `.env` (no se sube).
- **Verificado:** `npm run build` y `npm run lint` OK. `npm run dev` para desarrollo.

### Pendiente: Firebase
1. Crear proyecto en https://console.firebase.google.com (ej. nombre "fichas-quiniela").
2. Agregar app **Web** y copiar las 6 claves en `.env` (hay un `.env.example` de referencia).
3. Activar **Authentication** → sign-in "Correo electrónico/contraseña" (y Google si se quiere).
4. Crear base de datos **Firestore** (modo producción; región cerca de Argentina, ej. `southamerica-east1`).

### Pendiente: GitHub
1. Crear repo en https://github.com/new (ej. nombre "fichas-quiniela", público/privado).
2. Conectar el repo local ya inicializado:
   `git remote add origin https://github.com/USUARIO/fichas-quiniela.git`
   `git branch -M main`
   `git push -u origin main`

### Pendiente: Firestore (colecciones)
- `usuarios`, `agencias`, `clientes`, `movimientos_pendientes`, `movimientos_confirmados`.
- Crear primero `agencias` (178 y 362) y el usuario admin desde el panel en desarrollo.

## 2026-09-12 - Firebase conectado y datos iniciales cargados

### Qué se hizo
- Claves del proyecto Firebase `fichas-quiniela` cargadas en `.env` (no se sube a git).
- Script de seed (temporal, eliminado) inició sesión como admin y creó:
  - `usuarios/{uid}` → rol **admin**, agenciaId null, activo true.
  - `agencias/178` y `agencias/362`.
- **Dato clave:** la contraseña del admin tiene coma al final: `Sami1364,` (así quedó creada).
- UID del admin: `MpaKX9gxADfpRgrk3rKjeYqolLX2`.

### Pendientes
- Verificar que las reglas de Firestore permiten lectura al "vista pública" y restringen escritura (se definirá formalmente en la Etapa 3).
- Wireframes de las pantallas.
- Etapa 2: metodología.