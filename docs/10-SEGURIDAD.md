# 10 — Seguridad

## Datos sensibles

| Dato | Dónde se guarda | Nivel de exposición |
|------|-----------------|---------------------|
| Correos y contraseñas | Firebase Authentication | Nunca llegan a Firestore |
| Saldos y movimientos de clientes | Firestore | Solo lectura pública de confirmados; escritura requiere login |
| Auditoría (quién cargó/confirmó) | Firestore | Lectura solo autenticados |
| Claves de Firebase | `.env` | No se suben a git ni a Netlify |

## Variables de entorno

- Claves con prefijo `VITE_FIREBASE_*` en `.env`.
- `.env` está en `.gitignore` → nunca viaja al repositorio.
- En Netlify las variables se setean en el panel (Build → Environment).
- Se usa el `.env.example` como plantilla sin valores reales.

## Autenticación y roles

- Login con correo/contraseña de Firebase.
- El perfil se guarda en `usuarios/{uid}` con `rol` (`admin`/`empleado`)
  y `agenciaId`.
- `RutaProtegida` bloquea pantallas según sesión y rol.
- Cuentas deshabilitadas (`activo: false`) no pueden entrar.
- El empleado ve **solo** su agencia; el admin elige agencia.

## Validaciones

- En frontend: monto numérico positivo, fecha válida, descripción no
  vacía, roles y agencias dentro de listas permitidas.
- En Firestore (reglas): solo autenticados escriben; el público solo lee
  `clientes`, `agencias` y `movimientos_confirmados`.

```js
// firestore.rules (fase intermedia)
function autenticado() {
  return request.auth != null;
}

match /movimientos_pendientes/{id} {
  allow read, write: if autenticado();
}

match /movimientos_confirmados/{id} {
  allow read: if true;
  allow write: if autenticado();
}
```

## Qué nunca debe llegar al navegador / repositorio

- Contraseñas de usuario (solo viajan al servicio de Auth).
- Claves privadas ni `serviceAccount` de Firebase.
- Datos internos en `client-side`: `usuarios`, pendientes y tirillas se
  leen solo con sesión.
- El `localhost` no debe desplegarse con `VITE_*` de desarrollo.

## Buenas prácticas

- Sesión con alerta de inactividad (30 min) que cierra sola.
- Conteo de recursos por autenticado para evitar escritura masiva.
- Reglas finas planificadas al cierre: admin confirma, empleado solo su
  agencia, público solo lectura de planillas.
- Auditoría registra siempre quién y cuándo (creado/editado/confirmado).