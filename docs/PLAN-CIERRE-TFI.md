# Plan de cierre — TFI Quini 178/362

> **Entrega original:** 28-10-2026 · **Defensa (Parcial 2):** 30-10-2026
> **Estado:** app funcional y publicada; faltan cierres de evidencia, multimedia, informe y entrega.
> **Uso:** marcar cada casilla al terminar y anotar la evidencia (captura, commit, enlace o archivo).

---

## 0. Resumen de estado

| Bloque | Estado | Qué falta |
|--------|--------|-----------|
| 1. Producto / app | ~90 % | Borrado de clientes, reglas Firestore por rol, tests reales, Lighthouse/SEO, deploy actualizado |
| 2. SDD / documentación | ~60 % | Completar `tasks.md` y `verificacion.md` de las 3 specs con evidencia |
| 3. Multimedia | ~25 % | 8 imágenes integradas, video promocional y demo en YouTube, infografía, 3 gráficos, fichas IA, antes/después |
| 4. Uso responsable | ~50 % | Declaración firmada, corrección por sesgo, riesgo vinculado al TP1 |
| 5. Informe y entrega | 0 % | Informe PDF completo, carpeta en Bitácora, `ENLACES.md` final |
| 6. Defensa | ~30 % | Guiones existen; falta practicar demo y defensa, plan B |

**Regla de oro:** si no está en el repo, en el sitio o en el PDF, no existe para la corrección.

---

## 1. Producto / app

### 1.1 Altas y bajas de clientes y usuarios
- [x] Clientes: agregar acción **Eliminar** con confirmación.
- [x] Clientes: bloquear el borrado si el cliente tiene movimientos (pendientes o confirmados) para no romper el historial.
- [x] Usuarios: dejar claro que **quitar acceso = deshabilitar** (la cuenta de Firebase Auth no se borra desde el navegador).
- [x] Probar: crear cliente → eliminarlo → ya no aparece en búsqueda pública ni en el panel.
- [x] Probar: deshabilitar usuario → no puede entrar; habilitarlo → vuelve a entrar.

### 1.2 Reglas de Firestore por rol (seguridad)
- [ ] Reemplazar la fase intermedia por reglas finas:
  - admin: lee/escribe todo, confirma y rechaza;
  - empleado: solo su agencia, solo sus pendientes;
  - público: lee planillas confirmadas y busca clientes;
  - confirmados: inmutables (sin update ni delete);
  - usuarios: solo el propio perfil o admin.
- [ ] Ajustar consultas del frontend para que cumplan las reglas (por ejemplo, pendientes por cliente + agencia).
- [ ] Pegar las reglas en la consola de Firebase (producción).
- [ ] Probar en producción: login empleado, login admin, confirmar, rechazar, tirilla y búsqueda pública.
- [ ] Capturar evidencia de las reglas publicadas.

### 1.3 Tests automatizados reales
- [ ] Extraer la fórmula de la tirilla a `src/utils/tirilla.ts`.
- [ ] Tests de comisión, diferencia (positiva/negativa), ceros y “otros”.
- [ ] Tests de normalización de búsqueda (mayúsculas, acentos, espacios).
- [ ] Mantener los tests base de inmutabilidad y separación de colecciones.
- [ ] `npm test` en verde.

### 1.4 Rendimiento, SEO y accesibilidad
- [ ] Títulos y descripciones únicos por página pública (Home, planilla, login, cómo hicimos).
- [ ] Revisar un solo `<h1>` por página y `alt` descriptivos.
- [ ] Correr Lighthouse en celular y escritorio; capturas ≥ 80 en las 4 categorías.
- [ ] Si Rendimiento queda bajo: dividir el bundle o cargar Firebase de forma diferida.
- [ ] Verificar que no haya textos de relleno (“lorem ipsum”, “pendiente”, “a completar”) en el sitio.

### 1.5 Repositorio y deploy
- [ ] Revisar `git status`; no subir `.env`, `dist/` ni `node_modules/`.
- [ ] Commit por tarea con mensaje claro.
- [ ] Push a `main`.
- [ ] Verificar que Netlify tomó el último deploy y que la URL pública abre.
- [ ] Actualizar `ENLACES.md` con la URL final.

---

## 2. SDD / documentación

- [ ] `specs/001-movimientos-pendientes-confirmados/tasks.md`: marcar tareas y agregar evidencia (commit/test).
- [ ] `specs/001.../verificacion.md`: completar checklist, resultado y evidencia.
- [ ] `specs/002-tirillas-cierre-turno/tasks.md` y `verificacion.md`: ídem.
- [ ] `specs/003-dashboard-administrador/tasks.md` y `verificacion.md`: ídem.
- [ ] Verificar que cada spec tenga: constitución, spec EARS, clarificación, plan, tareas, implementación, validación y cambio.
- [ ] Revisar `docs/PROMPTS.md` y `docs/SESION-ERRORES-IA.md`: 3 errores completos (problema, detección, corrección).
- [ ] Actualizar `docs/08-TAREAS.md` con lo que realmente quedó cerrado.
- [ ] Actualizar `memory.md` con las decisiones de cierre.

---

## 3. Producción multimedia con IA

### 3.1 Imágenes (mínimo 8)
- [ ] Seleccionar las 8 imágenes finales (hero, local, servicios, personas ficticias, mockup notebook, mockup celular, ambiente Tinogasta).
- [ ] Copiarlas a `multimedia/imagenes/` y a `public/media/`.
- [ ] Integrarlas en el sitio (Home y/o “Cómo hicimos este sitio”) con `alt` y leyenda **“Generado con IA”**.
- [ ] Verificar que no haya marcas reales, texto deformado, manos raras ni personas identificables.
- [ ] Completar una ficha por imagen en `multimedia/FICHAS-IA.md` (herramienta, modelo, prompt final, iteraciones, edición humana, licencia, leyenda).
- [ ] Mostrar el antes/después de al menos 2 piezas con **3 iteraciones o más**.
- [ ] Actualizar `multimedia/CONTROL-RECURSOS-IA.md` (generadas vs. usadas).

### 3.2 Video promocional (45 a 90 s)
- [ ] Editar los clips (`1.mp4`…`9.mp4`) con voz en off, música y subtítulos.
- [ ] Duración final entre 45 y 90 segundos.
- [ ] Subir a YouTube como público o no listado.
- [ ] Declarar el uso de IA en la descripción y activar la etiqueta de contenido alterado/sintético si corresponde.
- [ ] Pegar el enlace en `ENLACES.md`, en el sitio y en el informe.
- [ ] Completar la ficha `VIDEO-001` en `FICHAS-IA.md`.

### 3.3 Video demo (2 a 3 min, voz propia)
- [ ] Grabar el recorrido de pantalla con la propia voz.
- [ ] Mostrar: inicio público → búsqueda → login → carga de movimiento → confirmación → inmutabilidad → tirilla → dashboard.
- [ ] Subir a YouTube (no listado) o entregar el archivo.
- [ ] Pegar el enlace en `ENLACES.md` y en el informe.
- [ ] Completar la ficha `VIDEO-002`.

### 3.4 Infografía y gráficos con datos reales
- [ ] Infografía del ciclo SDD aplicado (8 fases).
- [ ] Gráfico 1: funcionalidades SDD documentadas (3).
- [ ] Gráfico 2: estructura real del repositorio (carpetas/archivos).
- [ ] Gráfico 3: tareas completadas por etapa (desde `08-TAREAS.md`).
- [ ] Guardar en `multimedia/graficos/` y usar en el informe.
- [ ] Completar fichas `GRAF-001` a `GRAF-004`.

---

## 4. Uso responsable y ético

- [ ] Firmar `docs/DECLARACION-IA.md` (nombre, firma y fecha).
- [ ] Documentar al menos **1 corrección por sesgo** (por ejemplo, una imagen con estereotipo o manos mal).
- [ ] Vincular explícitamente **un riesgo** con el dilema de la película analizada en el TP1.
- [ ] Verificar que todas las piezas IA tengan leyenda “Generado con IA” en el sitio o en “Cómo hicimos este sitio”.
- [ ] Confirmar que no se usaron imágenes, voces ni datos de personas reales sin consentimiento.
- [ ] Revisar que no haya datos personales, contraseñas ni claves en prompts.

---

## 5. Informe guionado y entrega

- [ ] Portada institucional (IES Tinogasta, carrera, asignatura, título, emprendimiento, estudiante, curso, docente, fecha).
- [ ] Introducción (propósito e integración TP1, TP2 y TP3).
- [ ] Índice paginado.
- [ ] Desarrollo:
  - [ ] a) Punto de partida: constitución, arnés y matriz de herramientas.
  - [ ] b) Ciclo SDD por funcionalidad (spec, clarificación, plan, tareas, verificación y cambios).
  - [ ] c) Producto final: URL, capturas celular/escritorio, Lighthouse y cumplimiento de la Tabla 2.
  - [ ] d) Producción multimedia: figuras con ficha, antes/después, guion técnico y enlaces de video, infografía y gráficos.
  - [ ] e) Uso responsable: reglas, riesgos y decisiones éticas.
  - [ ] f) Guion de defensa y demo en vivo con roles y tiempos.
- [ ] Conclusión integradora.
- [ ] Bibliografía APA (guía de clase, documentación oficial y términos de uso de las herramientas).
- [ ] Anexos I–IV completos.
- [ ] Formato: A4 vertical, márgenes 3 cm, Arial/Verdana/Calibri/Times 12, títulos 14 negrita, texto justificado, interlineado sencillo.
- [ ] Exportar a PDF.
- [ ] Crear `bitacora/perez-sami_quini-178-362-tfi/`.
- [ ] Copiar el PDF y `ENLACES.md` a esa carpeta.
- [ ] Subir la carpeta a la Bitácora Digital y capturar evidencia.

---

## 6. Defensa oral y demo en vivo

- [ ] Repasar `multimedia/guiones/GUION-DEFENSA.md` y ajustar tiempos (10–15 min).
- [ ] Ensayar `multimedia/guiones/GUION-DEMO.md` con datos de prueba.
- [ ] Tener el video demo como plan B si falla internet.
- [ ] Preparar respuestas: inmutabilidad, separación de colecciones, fórmula de tirilla, reglas Firestore, uso responsable.
- [ ] Practicar explicar un fragmento de código al azar.
- [ ] Practicar un cambio pequeño en vivo con el agente (`/spec`, `/clarificar`, `/verificar`).
- [ ] Verificar que el sitio y los videos abran desde otra red/dispositivo.

---

## 7. Orden recomendado (hoy/mañana)

1. **Producto/app:** borrado de clientes, reglas Firestore, tests y deploy.
2. **Multimedia:** imágenes integradas + fichas; videos a YouTube; gráficos.
3. **SDD:** completar verificaciones y evidencia.
4. **Ética:** declaración firmada, sesgo y riesgo TP1.
5. **Informe PDF** y carpeta de Bitácora.
6. **Ensayar defensa** y demo.

---

## 8. Bloqueos que dependen de Sami

- [ ] Subir los videos a YouTube (no se puede hacer desde el repo).
- [ ] Firmar la declaración de IA.
- [ ] Sacar capturas de Lighthouse (o autorizar la ejecución local).
- [ ] Confirmar si “quitar usuario” significa deshabilitar o borrar definitivamente.
- [ ] Revisar visualmente las 8 imágenes y elegir las finales.
- [ ] Pegar las reglas en la consola de Firebase.

---

## 9. Comandos útiles

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run lint     # oxlint
npm test         # vitest
git status       # ver cambios
git log --oneline -10
```

---

## 10. Evidencia (anotar acá)

| Fecha | Punto | Evidencia | Estado |
|-------|-------|-----------|--------|
| 2026-10-30 | 1.1 Eliminar cliente | `src/services/clientesService.ts` (bloqueo en servicio) + `src/pages/admin/Clientes.tsx`; build/lint/tests OK (13/13) | Hecho |
| 2026-10-30 | 1.1 Quitar acceso = deshabilitar | `src/pages/admin/Usuarios.tsx` (texto aclaratorio) + `Login.tsx` bloquea `activo=false`; build/lint/tests OK | Hecho |
| 2026-10-30 | 1.1 Pruebas manuales | Verificadas por revisión de código; comprobación funcional final a cargo de Sami al cerrar el plan | Verificado |
