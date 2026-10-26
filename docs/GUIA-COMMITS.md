# Guía para commitear y subir por separado

Esta guía registra el orden usado para **6 commits por tarea** y para
publicar el repo `iest-tfi_quini-178-362`. Sirve como evidencia del TP4:
cada commit tiene un alcance claro y se puede explicar en el informe.

> Punto de partida (26-10-2026): 33 commits de la app ya estaban en la
> historia local. Los cambios del TP4 (identidad del repo, kit, app
> fusionada, paleta azul/teal y transparencia IA) estaban sin commitear.
> Nunca usar `git add -A` sin revisar: `.env`, `dist/` y `node_modules/`
> deben quedar fuera.

## 0. Verificación previa

```bash
cd "D:/Escritorio/Bitacora IA Perez Sami/iest-tfi_quini-178-362"
git branch --show-current
git remote -v
git check-ignore -v .env
git status --short
```

Esperado: rama `main`, remote nuevo, `.env` ignorado y cambios sin
commitear. Backup de seguridad:

```text
C:\Users\Usuario\AppData\Local\Temp\opencode\backup-tp4-20261026-150210
```

## 1. Los 6 commits

### Commit 1 — identidad del repositorio

```bash
git add README.md ENLACES.md docs/GUIA-COMMITS.md memory.md
git status --short
git commit -m "docs: actualizar nombre, enlaces y estado del repositorio"
```

Documenta el paso de `fichas-quiniela` a `iest-tfi_quini-178-362`, la
visibilidad pública y la URL nueva.

### Commit 2 — documentación y kit TP4

```bash
git add AGENTS.md CLAUDE.md docs specs multimedia .agents .opencode
git status --short
git commit -m "docs: incorporar kit TP4, specs y planes multimedia"
```

Incluye constitución, arnés, tareas, prompts, identidad, SEO, specs y
planes de multimedia.

### Commit 3 — entorno, build y tests

```bash
git add .gitignore .env.example package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts tests
git status --short
git commit -m "chore: configurar entorno, build, lint y tests"
```

No agregar `.env` real: solo `.env.example`.

### Commit 4 — app, identidad azul/teal y transparencia IA

```bash
git add src index.html public
git status --short
git commit -m "feat: integrar app de fichas con identidad azul/teal y transparencia IA"
```

Incluye la app de planillas, `/como-hicimos`, la leyenda «Generado con
IA», el pie público, el isotipo, los assets de marca y los tokens
azul/teal. El rojo queda solo para errores y acciones destructivas.

### Commit 5 — retirar el material heredado

```bash
git add -A PROYECTO
git status --short
git commit -m "chore: retirar material heredado de PROYECTO"
```

Solo registra las eliminaciones de la carpeta vieja.

### Commit 6 — alinear la estructura de carpetas del TP4

```bash
git rm --ignore-unmatch public/img/banner-compartir.png
git add public/media multimedia/video multimedia/graficos docs/04-ARQUITECTURA.md README.md docs/GUIA-COMMITS.md
git status --short
git commit -m "chore: alinear estructura de carpetas del TP4"
```

Deja `public/media/`, `multimedia/video/` y `multimedia/graficos/` visibles
en el repo, y retira el banner duplicado que no se usaba.

### Verificar

```bash
git log --oneline -8
git show --stat --oneline HEAD
git status --short
```

Deberían verse los 6 commits nuevos arriba de los 33 de la app.

## 2. Commits futuros

| Cuándo | Archivos | Mensaje sugerido |
|--------|----------|------------------|
| Imágenes finales | `multimedia/imagenes/`, `multimedia/FICHAS-IA.md`, `multimedia/CONTROL-RECURSOS-IA.md` | `multimedia: agregar 8 piezas generadas y fichas de IA` |
| Errores de IA | `docs/PROMPTS.md`, `docs/SESION-ERRORES-IA.md` | `docs: consolidar prompts y errores de IA` |
| Informe | `bitacora/perez-sami_quini-178-362-tfi/` | `docs: incorporar informe final TP4` |
| Videos/gráficos | `multimedia/` | `multimedia: agregar videos, infografía y gráficos` |
| Deploy | `ENLACES.md`, `README.md` | `docs: registrar URL de deploy y Lighthouse` |

Regla práctica: **un commit = una tarea terminada y verificada**. No
mezclar imágenes, informe y código en el mismo commit.

## 3. Renombrar el repo existente y dejarlo público

El repo original era `samelit-spect/fichas-quiniela` (privado). Para
cumplir el TP4 se renombró y se puso público:

```bash
gh repo rename -R samelit-spect/fichas-quiniela iest-tfi_quini-178-362 -y
gh repo edit samelit-spect/iest-tfi_quini-178-362 \
  --description "Trabajo Final Integrador de Quini 178/362: fichas digitales para agencias de quiniela. React + TypeScript + Vite + Firebase + SDD con IA." \
  --visibility public \
  --accept-visibility-change-consequences \
  --add-topic tfi --add-topic quini --add-topic quiniela \
  --add-topic react --add-topic typescript --add-topic vite \
  --add-topic firebase --add-topic sdd --add-topic ia --add-topic educacion
git remote set-url origin https://github.com/samelit-spect/iest-tfi_quini-178-362.git
git remote -v
git push -u origin main
```

Antes de hacer público un repo, auditar secretos:

```bash
git log --all --name-only --pretty=format: | sort -u | grep -Ei '(^|/)\.env|secret|credential|\.pem$|\.key$'
```

En este proyecto el único archivo sensible listado es `.env.example`; el
`.env` real está ignorado y no se sube.

Si se prefiere un repo nuevo en lugar de renombrar:

```bash
gh repo create iest-tfi_quini-178-362 --public
git remote add nuevo https://github.com/samelit-spect/iest-tfi_quini-178-362.git
git push -u nuevo main
```

No hacer `push --force` al repo viejo.

## 4. Publicar en Netlify

1. Netlify → **Add new site** → **Import an existing project** → GitHub.
2. Elegir `iest-tfi_quini-178-362`.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Cargar `VITE_FIREBASE_*` desde `.env.example` en **Site settings →
   Environment variables**. Nunca subir `.env`.
6. Deploy y probar `/`, `/login`, `/planilla/:id` y `/como-hicimos`.
7. Registrar la URL y el homepage del repo:

```bash
git add ENLACES.md README.md
git commit -m "docs: registrar URL de deploy"
git push
gh repo edit samelit-spect/iest-tfi_quini-178-362 --homepage "https://URL-DEL-SITIO"
```

## 5. Checklist antes de cada push

- [ ] `git status --short` no muestra `.env`, `dist/` ni `node_modules/`.
- [ ] `npm run build` pasa.
- [ ] `npm run lint` sin errores.
- [ ] `npm test` pasa.
- [ ] El commit tiene un mensaje claro y una sola tarea.
- [ ] `git log --oneline -5` se ve ordenado.
- [ ] `git remote -v` apunta a `iest-tfi_quini-178-362`.
- [ ] No hay claves ni tokens en los archivos staged.

## 6. Si algo sale mal

**Se agregó `.env` por error antes de commitear:**

```bash
git restore --staged .env
git status --short
```

**Un commit local quedó mal y todavía no se subió:**

```bash
git reset --soft HEAD~1
```

Corregir, volver a agregar y commitear. Si ya se subió, hacer un commit
de corrección en lugar de reescribir la historia.

**El push fue rechazado porque el remoto tiene cambios:**

```bash
git pull --rebase origin main
git push
```

**Se subió un secreto:** rotar la clave en Firebase/GitHub, quitarla del
archivo y, si es necesario, limpiar la historia con `git filter-repo`.
Nunca alcanza con borrar el archivo en un commit nuevo.

## 7. Historia esperada

```text
chore: alinear estructura de carpetas del TP4
chore: retirar material heredado de PROYECTO
feat: integrar app de fichas con identidad azul/teal y transparencia IA
chore: configurar entorno, build, lint y tests
docs: incorporar kit TP4, specs y planes multimedia
docs: actualizar nombre, enlaces y estado del repositorio
... 33 commits de la app ...
```

Eso demuestra commits separados por tarea, sin perder la historia de la
app y sin subir secretos.
