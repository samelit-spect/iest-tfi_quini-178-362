# Registro de errores de IA (mínimo 3)

| Caso | Contexto | Qué hizo mal | Cómo lo detecté (humano) | Cómo lo corregí (humano) |
|------|----------|---------------|---------------------------|---------------------------|
| 1 | Movimiento confirmado | Propuso permitir editar movimiento ya confirmado | Revisé reglas de negocio (inmutabilidad obligatoria) | Bloquear edición/eliminación, forzar corrección con nuevo movimiento |
| 2 | Separación colecciones | Sugirió usar un solo campo estado sin colecciones separadas | Revisé PLAN.md y CONSIGNAS TP4/TP3 | Mantener `movimientos_pendientes` y `movimientos_confirmados` separadas |
| 3 | Tirilla | Propuso modificar saldos al guardar tirilla | Revisé regla 12 (solo resumen, no modifica saldos) | Asegurar que solo lee confirmados y NO actualiza clientes/saldos |
