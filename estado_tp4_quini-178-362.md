# ESTADO DEL PROYECTO - TP4 INTEGRADOR (Quini 178/362)

Fecha de actualización: 2026-10-31
Repo: https://github.com/samelit-spect/iest-tfi_quini-178-362
Sitio: https://iest-tfi-quini-178-362.netlify.app

## A) CONSTITUCIÓN Y ARNÉS
- [x] Repo GitHub con formato `iest-tfi_quini-178-362` (público)
- [x] `docs/CONSTITUCUCION.md` con 8 principios (incluye uso responsable de IA)
- [x] `AGENTS.md` / `CLAUDE.md` / `memory.md`
- [x] `.opencode/commands/` con `spec.md`, `clarificar.md`, `verificar.md`
- [x] `.agents/skills/` con `verificar-criterios.md` y `documentar-sdd.md`
- [x] `docs/MATRIZ-HERRAMIENTAS.md` (Anexo I) completo (Ideogram para imágenes, Kling para video promo, voz propia para demo, Canva AI/ChatGPT para gráficos)
- [x] **PUNTO A: 100% CERRADO**

## B) DESARROLLO GUIADO POR ESPECIFICACIONES (SDD)
- [x] 3 funcionalidades completas: `001-movimientos-pendientes-confirmados/`, `002-tirillas-cierre-turno/`, `003-dashboard-administrador/`
- [x] Cada una con `spec.md`, `clarificacion.md`, `plan.md`, `tasks.md`, `verificacion.md`
- [x] Commits trazables por funcionalidad (git log revisado)
- [x] `docs/PROMPTS.md` con prompts clave + 3 errores documentados
- [x] 3 errores IA documentados (problema/detección/corrección): inmutabilidad movimientos, separación colecciones, tirilla sin modificar saldos
- [x] `docs/SESION-ERRORES-IA.md` complementario
- [x] **PUNTO B: 100% CERRADO**

## C) PRODUCTO FINAL PUBLICADO
- [x] Repo público
- [x] Sitio publicado con URL pública (Netlify)
- [x] Tests automatizados: **13/13 pasaron** (`npm test`)
- [x] Build sin errores: **dist/ generado correctamente**
- [x] README.md y ENLACES.md actualizados
- [x] Video promocional YouTube (45-90 seg): <https://youtu.be/LKNPjyKvsok>
- [ ] Video demo 2-3 min con voz propia - **PENDIENTE**
- [x] Lighthouse >= 80: móvil 97/100/100/100 y escritorio 100/100/100/100 (`docs/lighthouse/`)
- [x] Verificar "sin textos de relleno" en sitio (sin coincidencias en `src/`)
- [x] Repo pusheado a `main` y deploy actualizado en Netlify (31-10-2026)
- [ ] **PUNTO C: ~90%** (falta video demo e informe)

## D) PRODUCCIÓN MULTIMEDIA CON IA GENERATIVA
- [x] Uso de Ideogram (gratuito) documentado
- [ ] >= 8 imágenes fotorrealistas coherentes con marca
  - [x] Ya hay **8 imágenes** (2 prompts x 4 imágenes cada uno)
  - [ ] Falta completar con **mockups notebook/celular**, **personas ficticias usando el servicio**, **local/espacio con identidad Tinogasta**, revisar todas las 8 para cumplir lo pedido
- [x] Video promocional 45-90 seg (Kling gratuito) con guion técnico (Anexo II): <https://youtu.be/LKNPjyKvsok>
- [ ] Video demo 2-3 min con voz propia - **PENDIENTE**
- [ ] Infografía ciclo SDD - **PENDIENTE**
- [ ] >= 3 gráficos con datos REALES (commits/tareas/RF) - **PENDIENTE**
- [ ] `multimedia/FICHAS-IA.md` completo por pieza (Anexo III) - **PENDIENTE**
- [ ] Antes/después en >= 2 piezas (>=3 iteraciones) - **PENDIENTE**
- [ ] **PUNTO D: ~25%**

## E) USO RESPONSABLE Y ÉTICO
- [x] Principio 8 en CONSTITUCION.md
- [x] Documentación de errores IA
- [x] Leyenda "Generado con IA" - **FALTA VERIFICAR EN SITIO / AGREGAR SI NO ESTÁ**
- [ ] Sin imágenes/voces/personas reales sin consentimiento / sin deepfakes - **A VERIFICAR**
- [ ] Análisis de riesgos >= 3 + vincular con dilema TP1 - **PENDIENTE**
- [ ] Declaración jurada de uso de IA (Anexo IV) firmada - **PENDIENTE**
- [ ] Corrección por sesgo documentada (>=1) - **PENDIENTE**
- [ ] **PUNTO E: ~40%**

## F) INFORME GUIADO Y DEFENSA ORAL
- [ ] Informe PDF con estructura completa (portada, intro, a-f, conclusión, bibliografía APA, anexos I-IV) - **PENDIENTE**
- [ ] Guion técnico video (Anexo II) - **PENDIENTE**
- [ ] Guion demo en vivo + plan B - **PENDIENTE**
- [ ] Guion defensa con tiempos/roles - **PENDIENTE**
- [ ] Carpeta `bitacora/perez-sami_quini-178-362-tfi/` con informe PDF + `ENLACES.md` - **PENDIENTE**
- [ ] Practicar explicación código al azar + cambio en vivo con agente - **PENDIENTE**
- [ ] **PUNTO F: 0%**

## PREGUNTAS PARA LA PROFESORA (ANOTAR RESPUESTA)
- [ ] **Videos:** ¿Se puede hacer el video promocional con herramientas gratuitas? ¿Kling/PixAI/Hunyuan son aceptables? ¿Hay alguna restricción con créditos gratuitos? **DÓNDE HACERLO**
- [ ] **Voz:** ¿Se puede hacer el video demo **únicamente con mi propia voz** (grabación de pantalla) sin usar IA de voz? ¿O hay que usar alguna herramienta en particular? **DÓNDE HACERLO**
- [ ] **Lighthouse:** ¿Se pide captura móvil o escritorio? ¿Mínimo 80 en los 4 apartados o promedio?
- [ ] **Multimedia:** ¿Necesitamos obligatoriamente activar etiqueta "contenido alterado/sintético" en YouTube para el video promocional?
- [ ] **Informe:** ¿La carpeta debe ir **exactamente** con ese nombre en la bitácora digital? ¿Se puede entregar el repo con todo subido hasta el final?
- [ ] **Defensa:** ¿Pueden pedir explicar código al azar o hacer cambio en vivo con el agente? (Ya preparado, pero confirmar)

## PRIORIDADES PARA MAÑANA
1. Preguntar a la profesora las dudas de arriba (urgente)
2. Terminar/completar imágenes faltantes + `multimedia/FICHAS-IA.md`
3. Subir video promocional + video demo a YouTube (no listado/público) y actualizar `ENLACES.md`
4. Sacar capturas Lighthouse
5. Armar informe PDF con todos los anexos I-IV
6. Crear carpeta en bitácora con formato correcto y meter informe + ENLACES.md
7. Practicar defensa

## ÚLTIMOS AVANCES (LOG)
- 2026-10-31: Cierre 1.4 y 1.5 del plan; Lighthouse móvil 97 y escritorio 100; push y deploy Netlify.
- 2026-10-31: Las imágenes fuente de Ideogram quedan fuera del repo (`img provision/`, ignorada); las 4 finales ya están en `multimedia/imagenes/` y `public/media/`.
- 2026-10-26 08:27: Tests 2/2 OK, Build OK
- 2026-10-26 08:00: Punto A y B 100% cerrados, PROMPTS.md corregido, MATRIZ-HERRAMIENTAS.md completo
- 2026-10-26: Sitio publicado en Netlify, repo público, specs completas
