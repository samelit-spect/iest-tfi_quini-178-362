# CONSTITUCION.md — Quini 178/362

## Principios

1. **Stack definido**: Usar React + TypeScript + Vite + Tailwind CSS + Firebase (Auth + Firestore). No agregar librerías sin justificar en `docs/03-TECNOLOGIAS.md`.
2. **Marca única**: Respetar únicamente los colores, tipografías, logo e isotipo definidos en `docs/IDENTIDAD-MARCA.md` y en `public/marca/`.
3. **Arquitectura por capas**: Mantener separación clara entre componentes, páginas, servicios, contextos, hooks, utils y tipos.
4. **Calidad verificada**: Todo cambio debe pasar por build/lint cuando corresponda. Las funcionalidades se implementan con tests básicos cuando aplique.
5. **Seguridad primero**: Nunca subir claves o secretos al repositorio. Usar `.env`. Aplicar reglas de Firestore por rol.
6. **Idioma español**: Código, nombres de archivos, identificadores, comentarios y documentación en español.
7. **Accesibilidad**: Interfaz pensada para personas mayores (textos grandes, alto contraste, botones amplios).
8. **Uso responsable de IA**: La IA es una herramienta asistiva. Todo lo generado con IA debe revisarse, entenderse y poder explicarse. Se documentará su uso en `docs/PROMPTS.md`, `multimedia/FICHAS-IA.md` y `docs/DECLARACION-IA.md`. Sin uso de imágenes/voces de personas reales sin consentimiento.
