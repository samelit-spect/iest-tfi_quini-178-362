# 06 — Diseño de UI

Toda la interfaz sigue la identidad de `IDENTIDAD-MARCA.md` y está
pensada para **personas mayores**: tipografía grande, alto contraste,
botones amplios y navegación simple.

## Paleta y tipografía en pantalla

| Elemento | Valor |
|----------|-------|
| Fondo general | Crema `#F4F0EB` |
| Tarjetas | Blanco Ficha `#FAF9F7` |
| Texto | Carbón `#171412` |
| Acción principal | Azul Quiniela `#0F3D56` |
| Degradados y sombras | Azul Profundo `#092538` |
| Acento | Teal `#1F7A8C` |
| Agencia 178 | Verde `#0D9488` |
| Agencia 362 | Celeste `#0EA5E9` |
| Títulos y logo | **Bitter** |
| Cuerpo e interfaz | **Nunito** |

## Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Home | `/` | Buscador predictivo de planilla + botón iniciar sesión |
| Planilla pública | `/planilla/:clienteId` | Historial y saldo, solo lectura |
| Login | `/login` | Correo y contraseña |
| Elegir agencia | `/elegir-agencia` | Admin elige 178 o 362 |
| Agencia (planillas) | `/agencia/:agenciaId` | Grilla de clientes |
| Ficha del cliente | `/agencia/…/clientes/:id` | Sumar/restar, pendientes y confirmados |
| Tirillas | `/agencia/…/tirillas` | Cierre de turno en 3 columnas |
| Panel admin | `/admin/*` | Dashboard, usuarios, clientes, planillas |

## Cómo se aplica la identidad

### Botones

- Botones principales: fondo **azul** `#0F3D56`, texto blanco, bordes
  redondeados y **padding generoso** (objetivo táctil grande).
- Acciones por agencia (abrir planilla): verde `#0D9488` o celeste `#0EA5E9`.
- Acciones destructivas (rechazar, deshabilitar, salir): rojo/rosa, solo como acento.
- El rojo no se usa como color de marca; queda reservado para errores y acciones destructivas.

### Tarjetas

- Fondo blanco ficha, borde sutil, esquinas redondeadas y sombra suave.
- El saldo usa un **contador animado** para que el cambio se note con claridad.

### Formularios

- Campos (`input`, `select`, `textarea`) grandes con clase `.campo`.
- Etiquetas explícitas y mensajes de error en español claro.
- Foco visible para navegar con teclado.

### Navegación

- Menú del admin con pestañas grandes y texto + ícono.
- En móvil, menú hamburguesa; hay un cierre de sesión visible siempre.

### Créditos y débitos

- Crédito → verde, con signo `+`.
- Débito → carbón oscuro, con signo `−`.
- Pendiente → badge ámbar «Pendiente».

## Accesibilidad (WCAG AA)

- Contraste mínimo AA entre texto y fondo.
- `prefers-reduced-motion` respetado: se desactivan las animaciones.
- Textos entre `text-lg` y `text-2xl` para lectura cómoda.
- Etiquetas y botones nunca dependen solo del color (agregan texto).

## Ejemplo de estilo en código

```tsx
<button className="rounded-xl bg-brand-600 px-6 py-3 text-lg font-bold text-white hover:bg-brand-700">
  Sumar crédito
</button>
```

Los colores viven como tokens de Tailwind en `src/index.css`
(`brand‑*`, `cream-*`, `coal-950`).