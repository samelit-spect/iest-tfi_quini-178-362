# 07 — Convenciones

Código en **español**, salvo las palabras reservadas del lenguaje.

## Idiomas

| Dónde | Idioma | Ejemplo |
|-------|--------|---------|
| Nombres de archivos | español | `FichaCliente.tsx`, `movimientosService.ts` |
| Variables y funciones | español | `esClienteActivo()`, `totalCredito` |
| Componentes (`PascalCase`) | español | `PlanillaPublica`, `NavAdmin` |
| Texto visible en pantalla | español | «Sumar crédito» |
| Mensajes de commit | español | `feat: agregar exportación a PDF` |

## Nombres

### Archivos

- Componente/página → `NombreEnPascalCase.tsx`
- Servicio → `temaService.ts` en minúscula (`clientesService.ts`)
- Utilidad → `nombreClaro.ts` (`format.ts`, `normalizar.ts`)

### Variables y funciones

- Variables simples en `camelCase`: `saldoActual`, `listaPendientes`.
- Booleanos con `es/esta/tiene`: `esAdmin`, `estaCargando`, `tieneBuscador`.
- Funciones con verbo: `leerCliente()`, `guardarTirilla()`.

```ts
const esEmpleado = perfil.rol === 'empleado'

function leerCliente(id: string): Promise<Cliente> {
  // ...
}
```

## Tipos

- Todo el dominio se define en `` `src/types/index.ts` `` con `interface`.
- Se prefiere `type` para uniones: `Rol`, `TipoMovimiento`, `EstadoMovimiento`.
- Nunca usar `any` sin justificar.

## Componentes

- Un componente por archivo (export default).
- Props con `interface` nombrada `NombreProps`.
- Separar la lógica de datos en `services/`, la UI en `pages/components`.

## Commit

Formato `tipo: descripción corta en español`. Tipos usados:

```text
feat: agregar tirilla con comisión del agenciero
fix: corregir búsqueda insensible a acentos
docs: actualizar PLAN.md con decisión de agencias
refactor: extraer utilidad normalizar()
```

## Lint

Se usa **oxlint** (`npm run lint`). El código debe pasar sin errores y con
build OK (`npm run build`) antes de cada commit.