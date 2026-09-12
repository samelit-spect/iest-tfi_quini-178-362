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

## 2026-09-12 - Repositorio GitHub + despliegue en Netlify

### Qué se hizo
- Repositorio creado en GitHub: `samelit-spect/fichas-quiniela` (https://github.com/samelit-spect/fichas-quiniela.git).
- Repo local conectado al remote `origin` (branch `main`) y push inicial realizado.
- Netlify importado desde GitHub: Base directory vacío (código en la raíz), build `npm run build`, publish `dist`.
- Añadido `public/_redirects` (SPA: cualquier ruta → `/index.html`) para que `/login`, `/planilla/...`, etc. no den 404.
- Netlify queda configurado para **build automático en cada push** (ver cambios en tiempo real).
- Variables de entorno en Netlify: las mismas 6 claves `VITE_FIREBASE_*` del `.env`.
- URL del sitio en Netlify: **https://gleeful-beignet-736b8f.netlify.app/**

## 2026-09-12 - Fix: Netlify servía la fuente en vez del build

### Problema
- El sitio cargaba el `index.html` fuente (referenciaba `/src/main.tsx`) → error `Failed to load module script ... MIME application/octet-stream` (el `.tsx` no se sirve como JS).

### Solución
- Agregado `netlify.toml` al repo con:
  - `[build] command = "npm run build"`, `publish = "dist"`.
  - `[[redirects]]` `/* → /index.html 200` (SPA).
- Eliminado `public/_redirects` (la regla ahora vive en `netlify.toml`, evita duplicados).
- Al estar en el repo, Netlify toma esta configuración automáticamente en cada push (no depende del panel).

## 2026-09-12 - Requisito de accesibilidad: público de edad avanzada

- La mayoría de las personas que usan/venden/ven el sistema son **mayores**.
- Regla de diseño para TODO el sistema: tipografía grande y legible, alto contraste, botones y objetivos táctiles amplios, navegación simple y clara; evitar depender del hover o de detalles pequeños.
- Aplicar en vista pública y en las futuras vistas internas (empleado/admin).
- Queda registrado también en `PLAN.md` y en la Etapa 1 (RNF-04).

## 2026-09-12 - Login real (AuthContext) + redirección por rol

- **AuthContext** (`src/context/auth.ts` + `src/context/authContext.tsx`):
  - `onAuthStateChanged` restaura la sesión y lee el perfil desde `usuarios/{uid}`.
  - `login(email, password)` (signInWithEmailAndPassword) devuelve el perfil; `logout()`.
  - Expone `estado` (cargando/logueado/anonimo), `perfil`, `inicioPorRol`.
- **RutaProtegida** (`src/components/RutaProtegida.tsx`): redirige a `/login` si no hay sesión; bloquea cuentas deshabilitadas, sin agencia asignada (empleado) o sin perfil.
- **Login** funcional con errores claros en español (credenciales inválidas, cuenta deshabilitada, demasiados intentos, red, etc.), validación de perfil activo + agencia → redirige por rol: admin → `/elegir-agencia`, empleado → `/agencia/:agenciaId`.
- **ElegirAgencia** (solo admin): cards de la Agencia 178 y 362 → `/agencia/:id`.
- **Agencia** (empleado/admin): shell protegido con nombre/número de agencia, boton Salir y módulos "Planillas de clientes" y "Confirmaciones" anunciados como próximos.
- Home: si hay sesión, el botón cambia a "Entrar al panel" (según rol).
- **Verificado:** lint y build OK. Empleados aún no creados en Firestore (el admin es `perezsami008@gmail.com`).

### Cómo conectar en futuras sesiones
- **VS Code:** abrir la carpeta `Seminario proyecto 2`. Todo queda sincronizado vía panel Source Control (commit + push).
- **Netlify:** cada `git push` a `main` dispara el deploy.
- **Comandos útiles:** `npm run dev` (desarrollo local) · `npm run build` · `npm run lint`.

## 2026-09-12 - Vista pública (planilla del cliente) construida

### Qué se hizo
- Diseño de la **vista pública** (sin registro) en `Home` y `PlanillaPublica`:
  - `Home`: hero con marca, buscador **predictivo** por apellido y nombre (sugerencias en vivo, animado, insensible a mayúsculas y acentos vía campo `busqueda` normalizado) y botón "Iniciar sesión".
  - `PlanillaPublica` (`/planilla/:clienteId`): cabecera con datos del cliente + agencia, saldo actual con **contador animado**, resumen de créditos/débitos, lista de movimientos confirmados con animaciones escalonadas y total al pie.
- Sistema de diseño ampliado en `index.css`: paleta brand rojo + crema, fuente Nunito, animaciones `fade-up/fade-in/scale-in/float/shimmer` y utilidad `.bg-dots`. Respeta `prefers-reduced-motion`.
- Servicios nuevos:
  - `clientesService.ts`: `buscarClientes()` (normaliza minúsculas + sin acentos) y `leerCliente()`.
  - `movimientosService.ts`: `leerMovimientosConfirmados()` y `leerAgencia()`.
  - `utils/normalizar.ts`, `utils/format.ts` (pesos y fechas en es-AR), `hooks/useCountUp.ts`.
- **Datos demo** cargados en Firestore para probar la vista (script temporal, luego borrado):
  - Clientes: Pérez Juan (178), González María (178), Pérez Ana (362), Díaz Roberto (362) — incluye homónimos para probar la búsqueda.
  - Movimientos confirmados variados en `movimientos_confirmados`.
- **Nota:** los datos demo son de prueba; se pueden dejar como ejemplo o borrarse cuando haya datos reales.
- **Verificado:** `npm run lint` y `npm run build` OK.

## 2026-09-12 - Agencias desde Firestore (sin datos hardcodeados)

- Verificado en la base: `agencias/178` y `agencias/362` ya existen con `numero` + `nombre` ("Agencia 178" / "Agencia 362").
- **ElegirAgencia** ahora carga las agencias con `listarAgencias()` (nombre real desde la base; colores por nº: 178 verde, 362 celeste; fallback gris). Ya no están los nombres inventados hardcodeados.
- **Agencia** ya no valida "178/362" hardcodeado: decide según `leerAgencia()` (si no existe → página no encontrada). Rutas por id del doc (`/agencia/:agenciaId` = id del doc).
- **Usuarios** asigna la agencia con la lista real de `agencias` de la base (ya era así).
- **PlanillaPublica** muestra también el nombre real de la agencia.
- Pendiente: si el dueño quiere nombres reales distintos, se editan directo en Firestore (`agencias`).

### Próximos pasos
- Módulo de Planillas (carga de créditos/débitos) para llenar las Confirmaciones.

## 2026-09-12 - Panel de administración completo (usuarios + confirmaciones)

- **`/admin`** (solo rol admin; rutas `/admin/usuarios` y `/admin/confirmaciones`). Accesos: desde ElegirAgencia y desde la vista de agencia.
- **Usuarios:** lista todos los usuarios, crea nuevos (nombre, correo, contraseña, rol, agencia), edita (nombre/rol/agencia) y habilita/deshabilita (no deja auto-deshabilitarse).
  - **Creación de cuenta sin cambiar la sesión del admin:** se usa la REST API de Firebase Auth (`accounts:signUp` con la API key) en vez de `createUserWithEmailAndPassword`. Devuelve el `localId` (uid) y luego se crea el doc en `usuarios/{uid}` (activo: true).
  - Errores mapeados a español (correo repetido, contraseña corta, etc.).
- **Confirmaciones:** lista pendientes de ambas agencias (con cliente y nº de agencia), **Confirmar** (transacción: copia a `movimientos_confirmados` con estado confirmado + confirmadoPor/El y borra el pendiente → inmutable) y **Rechazar** (marca `estado: 'rechazado'` en el mismo doc).
- **ElegirAgencia rediseñada:** cards grandes (178 en verde esmeralda, 362 en celeste — colores propios, sin "todo rojo"), badge de admin y botón grande al Panel de administración.
- **Decisiones visuales:** el rojo queda solo como acento de marca / acciones destructivas (Deshabilitar, Rechazar, Salir). Paleta de administración neutral (blanco/crema/negro) con verdes y celestes por agencia.
- **Verificado:** lint y build OK. Pendiente de probar en Netlify y crear el primer empleado desde el panel.
- Agregado `.campo` en `index.css` (inputs grandes).