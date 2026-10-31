# PROMPTS.md

## Prompts clave utilizados

| Momento | Prompt utilizado (resumido) | Uso |
|---------|-----------------------------|-----|
| Especificación SDD | "Actúa como agente SDD. Genera `spec.md` para [funcionalidad] con objetivo, alcance, criterios de aceptación verificables y fuera de alcance." | Para crear las specs de las 3 funcionalidades. |
| Clarificación | "Revisá ambigüedades, preguntas y supuestos antes de pasar a `plan.md`. Solo preguntá lo necesario para decidir." | Usado con `/clarificar`. |
| Planificación y tareas | "Generá `plan.md` con enfoque por capas (componentes, servicios, hooks, tipos) y `tasks.md` con tareas pequeñas, verificables y en orden." | Para armar plan + tareas por funcionalidad. |
| Verificación | "Verificá contra `spec.md` y criterios de aceptación. Listá lo cumplido, lo faltante y sugerencias sin modificar código aún." | Usado con `/verificar`. |
| Imágenes con IA (Ideogram) | "Fotografía fotorrealista. SUJETO + ACCIÓN + ENTORNO (Tinogasta, local comercial) + LUZ natural de tarde + CÁMARA 50mm + ESTILO documental/fotorrealista + PALETA azul #0F3D56 / cian #1F7A8C + RESTRICCIONES: sin texto, sin logos, sin marcas reales, manos con 5 dedos, personas ficticias." | Para las imágenes generadas con Ideogram (8 imágenes con 2 prompts distintos). |

## Errores cometidos por la IA (mínimo 3)

| Caso | Contexto | Qué hizo mal | Detección humana | Corrección humana |
|------|----------|---------------|-------------------|---------------------|
| 1 | Movimiento confirmado | Propuso permitir editar movimiento ya confirmado | Revisé reglas de negocio (movimientos confirmados deben ser inmutables) | Bloquear edición/eliminación de `movimientos_confirmados`. Forzar corrección con un NUEVO movimiento que siga el flujo `pendiente -> confirmado` con auditoría. |
| 2 | Separación de colecciones | Sugirió usar un solo campo `estado` sin separar colecciones | Revisé `plan.md` y las consignas del TP3/TP4 (separación obligatoria) | Mantener dos colecciones separadas: `movimientos_pendientes` y `movimientos_confirmados`. Al confirmar se traslada con trazabilidad y auditoría. |
| 3 | Tirilla de cierre de turno | Propuso modificar saldos al guardar tirilla | Revisé la regla 12: "Es solo resumen: no modifica los saldos de los clientes." | La tirilla SOLO lee movimientos CONFIRMADOS del día. NO actualiza clientes ni saldos. Únicamente guarda el resumen con fecha, usuario y totales. |
