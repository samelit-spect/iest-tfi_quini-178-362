# PROMPTS.md

## Prompts clave
(Registrar aquí los pedidos importantes)

## Errores cometidos por la IA (mínimo 3)
| Caso | Qué hizo mal | Detección humana | Corrección humana |
|------|---------------|-------------------|-------------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## Ejemplos de prompts documentados
- Prompt para imágenes fotorrealistas con estructura SUJETO+ACCIÓN+ENTORNO+LUZ+CÁMARA+ESTILO+MARCA+RESTRICCIONES
- Prompt para spot 45-90s con guion técnico

## Errores cometidos por la IA (mínimo 3) - Conforme a Actividad 2

| Caso | Qué hizo mal | Detección humana | Corrección humana |
|------|---------------|-------------------|-------------------|
| 1 | Propuso permitir editar movimiento ya confirmado | Revisé reglas de negocio (movimientos confirmados deben ser inmutables) | Bloquear edición/eliminación de `movimientos_confirmados`. Forzar corrección con un NUEVO movimiento que siga el flujo pendiente -> confirmación. |
| 2 | Sugirió usar un solo campo `estado` sin separar colecciones | Revisé PLAN.md y consigna TP3/TP4 (separación obligatoria) | Mantener dos colecciones separadas: `movimientos_pendientes` y `movimientos_confirmados`. Al confirmar se mueve de una a otra con auditoría. |
| 3 | Propuso modificar saldos al guardar la tirilla | Revisé regla 12: "Es solo resumen: no modifica los saldos de los clientes." | La tirilla SOLO lee movimientos CONFIRMADOS del día. NO actualiza clientes ni saldos. Solo guarda resumen con auditoría. |
