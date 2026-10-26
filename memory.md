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

## Pendientes inmediatos
- Ejecutar los 5 commits de `docs/GUIA-COMMITS.md` y pushear a
  `https://github.com/samelit-spect/iest-tfi_quini-178-362`.
- Crear el sitio nuevo en Netlify, cargar `VITE_FIREBASE_*` y registrar la URL.
- 8 imágenes finales con paleta azul/teal, 3 iteraciones en al menos 2 piezas y fichas
  en `multimedia/FICHAS-IA.md`. Documentar el error del primer prompt (agencia de adobe)
  y la evolución al segundo prompt (local comercial).
- Videos, infografía y gráficos con datos reales.
- Consolidar `docs/PROMPTS.md` / `docs/SESION-ERRORES-IA.md` y sumar el error de las imágenes.
- Informe PDF en `bitacora/perez-sami_quini-178-362-tfi/`.
