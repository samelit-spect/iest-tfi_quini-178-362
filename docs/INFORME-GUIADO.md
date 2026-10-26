# Informe guionado - Estructura TFI

## 1. Portada
- Institución: Instituto de Estudios Superiores de Tinogasta
- Carrera: Tec. en Desarrollo de Software
- Asignatura: Inteligencia Artificial
- Título: Trabajo Final Integrador: Del prompt al producto — Desarrollo completo de Quini 178/362 con Inteligencia Artificial
- Emprendimiento: Quini 178/362
- Estudiante: Perez Sami
- Año y curso: 3er Año
- Docente a cargo: Barrionuevo, Ana Camila
- Fecha de entrega: 28-10-2026

## 2. Introducción
Propósito: integrar ética, ecosistema de modelos y SDD para convertir las especificaciones del TP3 en un producto funcional.
Se integran contenidos TP1 (dilemas éticos), TP2 (modelos/herramientas), TP3 (especificaciones Markdown).

## 3. Índice
(ver desarrollo)

## 4. Desarrollo

### a) Punto de partida
- Emprendimiento retomado: Quini 178/362
- `docs/CONSTITUCION.md` (8 principios, uso responsable)
- Arnés: AGENTS.md, CLAUDE.md, memory.md, comandos (/spec,/clarificar,/verificar), skills (verificar-criterios, documentar-sdd)
- Matriz: `docs/MATRIZ-HERRAMIENTAS.md`

### b) Ciclo SDD
**001 - movimientos-pendientes-confirmados**
- Spec (EARS), clarificación, plan, tasks, verificación
- Hallazgos: inmutabilidad, dos colecciones
- Errores IA: ver `docs/SESION-ERRORES-IA.md`

**002 - tirillas-cierre-turno**
- Solo lee confirmados, no modifica saldos, arrastre diferencia, comisión

**003 - dashboard-administrador**
- Pendientes, movimientos del día, resumen por agencia

### c) Producto final
- Estructura: Vite+React+TS+Tailwind+Firebase
- Mobile-first, variables CSS
- Tests automatizados (`tests/basico.test.ts`)
- Sin textos de relleno
- URL pública: (a completar al desplegar)
- Repo GitHub: (a completar)
- Lighthouse ≥ 80 (a verificar)

### d) Producción multimedia
- 8 imágenes planificadas en `multimedia/PLAN-IMAGENES.md`
- Guion spot 45-90s + enlace YouTube (a completar)
- Video demo 2-3 min con propia voz (a completar)
- Infografía SDD + 3 gráficos con datos reales
- Fichas en `multimedia/FICHAS-IA.md`

### e) Uso responsable
- Reglas aplicadas, `docs/05-USO-RESPONSABLE.md`
- Riesgos + vinculación TP1
- `docs/DECLARACION-IA.md`

### f) Guion defensa y demo
- `multimedia/guiones/GUION-DEFENSA.md`, `GUION-DEMO.md`, `GUION-TECNICO-SPOT.md`

## 5. Conclusión
Reflexión integradora: IA asistiva con criterio humano. Aprendizaje: especificar antes de programar. Próximos pasos: completar multimedia, desplegar, subir a GitHub.

## 6. Bibliografía (APA)
- Barrionuevo, C. (2026). Guía de clase Inteligencia Artificial. IES Tinogasta.
- OpenAI. (s. f.). Documentación. https://platform.openai.com/docs
- Firebase. (s. f.). Documentación. https://firebase.google.com/docs
- React. (s. f.). Documentación. https://es.react.dev/
- Vite. (s. f.). Documentación. https://es.vitejs.dev/

## 7. Anexos
- Anexo I: `docs/MATRIZ-HERRAMIENTAS.md`
- Anexo II: `multimedia/guiones/GUION-TECNICO-SPOT.md`
- Anexo III: `multimedia/FICHAS-IA.md`
- Anexo IV: `docs/DECLARACION-IA.md`
- Prompts: `docs/PROMPTS.md`
- Errores IA: `docs/SESION-ERRORES-IA.md`
- Specs: `specs/`
