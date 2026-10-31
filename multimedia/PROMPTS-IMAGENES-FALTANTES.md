# Prompts para las imágenes faltantes (IMG-005 a IMG-008)

Generar en Ideogram (o similar), formato horizontal **3:2**, tamaño aproximado **2496 × 1664 px**.
Guardar cada archivo en la **raíz del proyecto** con el nombre exacto que figura en cada caso
(`.jpg`, `.png` o `.webp`; después se normaliza).

## Reglas generales para todos los prompts
- Sin texto legible, sin logos ni marcas reales, sin nombres de comercios.
- Personas ficticias, no identificables, sin parecido con famosos.
- Manos anatómicamente correctas, 5 dedos.
- Sin DNI, documentos, teléfonos ni datos personales.
- Paleta azul petróleo `#0F3D56` y cian `#1F7A8C`.
- Luz natural de tarde, estilo fotografía documental.
- Leyenda en el sitio: **“Generado con IA”**.

---

## 1. IMG-005 — Empleado cargando un movimiento

**Archivo:** `IMG-005-empleado-carga.jpg`

**Prompt:**
Fotografía fotorrealista documental. Una persona adulta ficticia, empleada de una pequeña agencia de quiniela, de perfil, carga un movimiento en una computadora detrás del mostrador. Interior de agencia en Tinogasta, Catamarca: paredes claras, mostrador de madera, ventana con luz natural de tarde. La pantalla se ve de costado y muestra una interfaz abstracta azul/teal sin texto legible. Cámara DSLR 35 mm, plano medio lateral, profundidad de campo suave. Estilo realista, sin sobre-filtro. Paleta azul petróleo #0F3D56 y cian #1F7A8C. RESTRICCIONES: sin texto legible, sin logos ni marcas reales, sin DNI ni documentos, sin datos personales, persona ficticia no identificable, manos con 5 dedos, sin errores anatómicos.

**Iteración 3 (para antes/después):** `IMG-005-empleado-carga-v3.jpg` — mismo prompt, cambiando el encuadre a plano medio frontal del empleado mirando la pantalla, con el mostrador en primer plano y la ventana al fondo.

---

## 2. IMG-006 — Ambiente de Tinogasta

**Archivo:** `IMG-006-ambiente-tinogasta.jpg`

**Prompt:**
Fotografía fotorrealista de paisaje urbano-rural. Calle típica de Tinogasta, Catamarca, Argentina: casas bajas de adobe y revoque, veredas angostas, árboles y cerros secos al fondo. Tarde cálida, luz natural rasante, cielo limpio. Cámara DSLR 24 mm, punto de vista peatonal, composición documental sin turistas ni personas reconocibles. Paleta azul petróleo #0F3D56 y cian #1F7A8C en sombras y detalles. RESTRICCIONES: sin carteles con texto legible, sin logos, sin marcas reales, sin placas con nombres, sin personas identificables, sin autos con patentes legibles.

---

## 3. IMG-007 — Mockup notebook

**Archivo:** `IMG-007-mockup-notebook.jpg`

**Prompt:**
Fotografía de producto fotorrealista. Notebook abierto sobre una mesa de madera en un ambiente luminoso y ordenado, con una taza simple y una planta pequeña fuera de foco. La pantalla muestra una interfaz web abstracta en azul/teal, tipo planilla digital, sin texto legible. Ángulo tres cuartos, cámara 50 mm, luz natural de ventana, profundidad de campo suave. Estilo publicitario sobrio y realista. Paleta azul petróleo #0F3D56 y cian #1F7A8C. RESTRICCIONES: sin texto legible en pantalla, sin logos ni marcas reales de notebook, sin marcas de agua, sin manos, sin reflejos que deformen la pantalla.

---

## 4. IMG-008 — Mockup celular

**Archivo:** `IMG-008-mockup-celular.jpg`

**Prompt:**
Fotografía fotorrealista. Una mano ficticia sostiene un smartphone en posición vertical, en un exterior tranquilo de Tinogasta con luz natural de tarde y cerros desenfocados al fondo. La pantalla muestra una interfaz web abstracta azul/teal, tipo planilla pública, sin texto legible. Cámara 50 mm, plano medio corto, enfoque en la pantalla y la mano, fondo con bokeh suave. Estilo documental-publicitario. Paleta azul petróleo #0F3D56 y cian #1F7A8C. RESTRICCIONES: mano anatómicamente correcta con 5 dedos, sin texto legible, sin logos ni marcas reales, sin datos personales, sin uñas perfectas de CGI, sin reflejos que tapen la pantalla.

**Iteración 3 (para antes/después):** `IMG-008-mockup-celular-v3.jpg` — mismo prompt, cambiando a dos manos sosteniendo el celular y una oficina pequeña desenfocada al fondo, para corregir la anatomía de la mano.

---

## Antes/después (mínimo 2 piezas con 3 iteraciones)

Para completar el requisito, además de las imágenes finales, guardar en la raíz:

| Pieza | Iteración 1 | Iteración 2 | Iteración 3 |
|---|---|---|---|
| Hero | `IMG-001-hero-portada-v1.jpg` | `IMG-001-hero-portada-v2.jpg` | `IMG-001-hero-portada-v3.jpg` |
| Persona | `IMG-004-persona-uso-v1.jpg` | `IMG-004-persona-uso-v2.jpg` | `IMG-004-persona-uso-v3.jpg` |

Las iteraciones 1 y 2 pueden ser las versiones de `img provision/` que ya tenés; solo faltaría generar la v3 con el prompt final corregido. Si preferís, la v3 de IMG-005 e IMG-008 de arriba también sirve para documentar la evolución.

## Al dejarlas en la raíz

Con que estén en la raíz del proyecto alcanza. Yo me encargo de:
1. Copiarlas a `multimedia/imagenes/` y `public/media/`.
2. Ajustar formato/tamaño si hace falta.
3. Integrarlas en el sitio con `alt` y leyenda “Generado con IA”.
4. Completar `FICHAS-IA.md`, `CONTROL-RECURSOS-IA.md` y el antes/después.
