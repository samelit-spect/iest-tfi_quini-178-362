# 05 - Uso responsable y ético

## Reglas aplicadas
- [x] Transparencia: piezas generadas con IA identificadas
- [x] Sin personas reales sin consentimiento (solo ficticias)
- [x] Sin imitar marcas/logos/artistas
- [x] Sin datos personales en prompts
- [x] Revisión humana obligatoria
- [x] Leyenda "Generado con IA" en sitio/informe

## Análisis de riesgos (mínimo 3)

| Riesgo | A quién afecta | Probabilidad/Impacto | Mitigación |
|--------|----------------|---------------------|------------|
| Uso indebido de datos personales | Clientes/usuarios | Medio/Alto | No subir datos reales a prompts. Usar `.env`. Reglas Firestore. |
| Generación de contenido engañoso (deepfake) | Público | Medio/Alto | Solo personas ficticias. Prohibido deepfakes. Sin voces/imágenes reales. |
| Errores de IA en código | Desarrollo/usuario | Medio/Alto | Revisión humana, tests, /verificar, entender todo el código antes de aceptar. |

## Vinculación con TP N° 1
Se retoman los dilemas éticos analizados: la IA debe ser asistiva, con supervisión humana y responsabilidad del desarrollador.
