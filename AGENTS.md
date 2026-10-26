# AGENTS.md — iest-tfi_quini-178-362

## Propósito
Este repositorio contiene el Trabajo Final Integrador de Quini 178/362. Todo agente de IA debe leer `docs/CONSTITUCION.md` antes de actuar.

## Reglas
- Seguir estrictamente `docs/CONSTITUCION.md`
- Trabajar una tarea por vez (ver `docs/08-TAREAS.md` y `specs/*/tasks.md`)
- Usar solo identidad definida en `docs/IDENTIDAD-MARCA.md` y `public/marca/`
- Código e identificadores en español
- Nunca subir `.env` ni secretos
- Movimientos confirmados son inmutables
- Documentar prompts en `docs/PROMPTS.md` y errores de IA (problema/detección/corrección)
- Registrar piezas IA en `multimedia/FICHAS-IA.md`

## Comandos disponibles
- `/spec` - Crear/especificar funcionalidad siguiendo SDD
- `/clarificar` - Resolver ambigüedad antes de planificar
- `/verificar` - Verificar cumplimiento contra spec/criterios

## Skills
- `verificar-criterios` (obligatoria)
- Skills propias según necesidad

## Memoria
Registrar decisiones importantes en `memory.md`. Conversaciones cortas: una tarea, una conversación.
