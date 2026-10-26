# 09 — SEO

Las páginas **públicas** buscan aparecer en Google. Las secciones con
login no se indexan (requieren sesión).

## Títulos y descripciones por página

| Página | Título (`<title>`) | Meta descripción |
|--------|--------------------|------------------|
| Home | Quini 178/362 · Tu planilla de la agencia, sin papel | Consultá en línea los créditos y débitos de tu ficha en la agencia de quiniela. Buscá tu planilla con apellido y nombre, sin registrarte. |
| Planilla pública | Planilla de {cliente} · Quini 178/362 | Historial de movimientos y saldo actual de la ficha en la agencia. Solo lectura. |
| Login | Iniciar sesión · Quini 178/362 | Acceso para empleados y administradores de las agencias 178 y 362. |

## Palabras clave

- ficha de quiniela
- planilla de quiniela online
- consultar saldo quiniela
- agencia de quiniela 178
- agencia de quiniela 362
- créditos y débitos quiniela
- tirilla / cierre de turno quiniela

## Metadatos estándar

```html
<meta name="description" content="Consultá en línea los créditos y débitos de tu ficha." />
<meta name="robots" content="index, follow" />
<meta property="og:title" content="Quini 178/362 · Tu planilla, sin papel" />
<meta property="og:image" content="/marca/banner-compartir.png" />
```

## Texto alternativo de imágenes

| Imagen | `alt` |
|--------|-------|
| Logo principal | «Logo de Quini 178/362» |
| Isotipo | «Isotipo de Quini 178/362» |
| Banderín / hero (si se agrega) | «Fichas de quiniela digitales en el celular» |

## Buenas prácticas aplicadas

- El buscador público es la puerta de entrada: título claro que
  menciona «sin registrarse».
- Rutas SPA resueltas por Netlify (`netlify.toml`) para que ninguna
  URL dé error 404.
- Sin embargo, las páginas de login/panel llevan `noindex` para no
  aparecer en resultados.

### Lista de control

- [ ] `title` y `description` únicos por página pública.
- [ ] **Un solo `<h1>`** por página.
- [ ] `<html lang="es">` siempre.
- [ ] Isotipo/logo con `alt` descriptivo.
- [ ] Etiquetas semánticas (`header`, `main`, `footer`).
- [ ] **PageSpeed ≥ 90** en celular antes del deploy.