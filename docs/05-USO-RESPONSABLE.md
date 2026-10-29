# 05 - Uso responsable y ético

## Reglas aplicadas
- [x] Transparencia: piezas generadas con IA identificadas (leyenda "Generado con IA")
- [x] Sin personas reales sin consentimiento (solo ficticias)
- [x] Sin imitar marcas/logos/artistas
- [x] Sin datos personales en prompts
- [x] Revisión humana obligatoria
- [x] Leyenda "Generado con IA" en sitio/informe (/galeria y /como-hicimos)

## Análisis de riesgos (mínimo 3)

| Riesgo | A quién afecta | Probabilidad/Impacto | Mitigación |
|--------|----------------|---------------------|------------|
| Uso indebido de datos personales | Clientes/usuarios | Medio/Alto | No subir datos reales a prompts. Usar `.env`. Reglas Firestore por rol. |
| Generación de contenido engañoso (deepfake) | Público | Medio/Alto | Solo personas ficticias. Prohibido deepfakes. Sin voces/imágenes reales. Se prioriza voz propia. |
| Errores de IA en código | Desarrollo/usuario | Medio/Alto | Revisión humana, tests, /verificar, entender todo el código antes de aceptar. Movimientos confirmados inmutables. |

## Vinculación con TP N° 1
Se retoman los dilemas éticos analizados en el TP1 (película). El riesgo central es delegar decisiones sin criterio: **la IA debe ser asistiva, nunca autónoma**. Ante la tentación de aceptar código sin entenderlo, se opta por especificar primero (SDD), revisar, probar y poder explicar cada cambio. Esto vincula el dilema "¿hasta dónde delegamos?" con la práctica: el desarrollador sigue siendo responsable del producto.

## Corrección por sesgo
- **Detección:** En la primera iteración con Ideogram, las imágenes generadas tendían a mostrar un ambiente genérico tipo agencia de marketing/publicidad, sin identidad regional.
- **Corrección:** Se ajustó el prompt para ambientar explícitamente en **Tinogasta, Catamarca** (casas de adobe, cerros, luz de tarde) y forzar paleta **azul/teal** coherente con la marca, además de personas ficticias y sin texto/marcas reales.
- **Resultado:** Mayor coherencia con la identidad del emprendimiento y menor riesgo de estereotipos genéricos.
