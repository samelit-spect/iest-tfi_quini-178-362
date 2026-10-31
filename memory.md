# memory.md

## Decisiones
- Proyecto: Quini 178/362 (retomado de TP N° 3)
- Stack: React + TypeScript + Vite + Tailwind CSS + Firebase (Auth + Firestore)
- Repositorio TFI: `iest-tfi_quini-178-362`
- 2026-10-26: Se fusionó la app funcional de `Quiniela proyecto 2` dentro del repo TFI,
  conservando los 33 commits originales. Se agregaron `ComoHicimos.tsx`, `LeyendaIA.tsx`,
  `PiePublico.tsx`, assets de marca en `public/marca/` y se unificó la paleta a
  azul/teal (#0F3D56, #1F7A8C) sobre crema. El rojo #E12631 queda solo para errores
  y acciones destructivas. Build, lint y tests pasan.
- 2026-10-26: La paleta azul/teal se eligió para que el sitio coincida con las
  imágenes generadas y con los prompts de `multimedia/`. Se actualizaron SVG, PNG,
  favicon, banner, `IDENTIDAD-MARCA.md`, `06-DISENO-UI.md` y `paleta.md`.
- 2026-10-26: El repo de GitHub `samelit-spect/fichas-quiniela` se renombró a
  `iest-tfi_quini-178-362`, se puso público y se actualizaron descripción y temas.
  El remote local ya apunta a la URL nueva. El deploy anterior de Netlify devuelve
  404; falta crear el sitio nuevo.
- 2026-10-26: Se actualizaron `README.md`, `ENLACES.md` y `docs/GUIA-COMMITS.md` con
  el nombre y la URL nuevos. La guía propone 6 commits por tarea, empezando por la
  actualización de identidad del repositorio.
- 2026-10-26: Se alineó la estructura con el TP4: `public/media/`, `multimedia/video/`
  y `multimedia/graficos/` quedaron visibles con README, y se retiró el banner
  duplicado de `public/img/`.

- 2026-10-31: Se cerraron las secciones 1.1 a 1.5 del plan. Rutas con `lazy`,
  Firebase en chunks separados y Auth diferido hasta interacción o ruta con sesión.
  Lighthouse final: móvil 97/100/100/100 y escritorio 100/100/100/100. Se agregó
  `public/robots.txt` y se separaron los reportes en `docs/lighthouse/`.
- 2026-10-31: Commits `8139654`, `ce9ac0c`, `2801010` y `2a68c12` pusheados a `main`.
  Netlify actualizado con deploy manual (`6ae58514cabf5acda184e5b9`).
- 2026-10-31: Specs 001, 002 y 003 completadas con `implementacion.md`, `cambio.md`,
  `tasks.md` y `verificacion.md`. Los 3 errores de IA quedaron documentados en
  `docs/PROMPTS.md` y `docs/SESION-ERRORES-IA.md`.
- 2026-10-31: Las imágenes fuente de Ideogram (`img provision/`) quedan fuera del repo;
  las 4 finales están versionadas en `multimedia/imagenes/` y `public/media/`.

## Pendientes inmediatos
- Pegar las reglas de Firestore en la consola de producción y probar los flujos con
  usuarios reales (Sami).
- Video demo de 2 a 3 minutos con voz propia y ficha `VIDEO-002`.
- Completar imágenes/fichas restantes, antes/después, infografía y 3 gráficos con datos reales.
- Firmar `docs/DECLARACION-IA.md` y documentar una corrección por sesgo.
- Informe PDF en `bitacora/perez-sami_quini-178-362-tfi/` y carga en la Bitácora Digital.
- Ensayar la defensa oral y la demo en vivo.
