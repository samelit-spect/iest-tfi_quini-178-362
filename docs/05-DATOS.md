# 05 — Datos

La base es **Cloud Firestore**, organizada en colecciones. Los movimientos
se guardan en **dos colecciones separadas**: pendientes (editables) y
confirmados (inmutables).

## Entidades

| Colección | Campo | Tipo | Descripción |
|-----------|-------|------|-------------|
| `agencias` | `numero` | number | Número de la agencia (178 / 362) |
| | `nombre` | string | Nombre visible («Agencia 178») |
| | `comisionPorcentaje` | number | Comisión del agenciero (8 por defecto) |
| `usuarios` | `email` | string | Correo de acceso |
| | `nombre` | string | Nombre del usuario |
| | `rol` | string | `admin` o `empleado` |
| | `agenciaId` | string/null | Agencia del empleado (null para admin) |
| | `activo` | boolean | Habilitado o deshabilitado |
| `clientes` | `apellido` | string | Apellido |
| | `nombre` | string | Nombre |
| | `agenciaId` | string | Agencia a la que pertenece |
| | `busqueda` | string | Texto normalizado (minúsculas, sin acentos) |
| | `creadoEl` | string | Fecha de alta (ISO) |
| `movimientos_pendientes` | `clienteId` | string | Ficha del cliente |
| | `agenciaId` | string | Agencia |
| | `tipo` | string | `credito` o `debito` |
| | `monto` | number | Importe en pesos |
| | `descripcion` | string | Concepto |
| | `fecha` | string | Fecha del movimiento (ISO) |
| | `estado` | string | `pendiente` (o `rechazado`) |
| | `creadoPor*` | string | UID y nombre de quien cargó |
| | `editadoPor*` | string | UID y nombre de quien editó (opcional) |
| `movimientos_confirmados` | igual que pendientes | — | Mismo esquema + campos `confirmado*` |
| `tirillas` | `agenciaId` | string | Agencia |
| | `fecha` | string | Fecha del cierre (ISO) |
| | `turno` | string | `manana` o `tarde` |
| | `ventas` | number | Total vendido |
| | `premios` | number | Premios pagados |
| | `caja` | number | Dinero en caja |
| | `diferenciaAnterior` | number | Arrastrada del cierre previo |
| | `otros` | array | Conceptos varios `{ concepto, importe }` |
| | `comision` | number | Comisión del agenciero calculada |
| | `diferencia` | number | Lo que falta para cuadrar |
| | `creadoPor*` / `editadoPor*` | string | Auditoría |

## Regla de integridad clave

Un movimiento **nunca** se modifica después de confirmado: al confirmar
se **copia** a `movimientos_confirmados` y se **borra** el pendiente.
Los errores se corrigen con un movimiento nuevo tipo «Corrección».

## Ejemplo de datos

```json
{
  "agencias/178": { "numero": 178, "nombre": "Agencia 178", "comisionPorcentaje": 8 },
  "clientes/perez-juan": {
    "apellido": "Pérez",
    "nombre": "Juan",
    "agenciaId": "178",
    "busqueda": "perez juan"
  },
  "movimientos_confirmados/mv-001": {
    "clienteId": "perez-juan",
    "agenciaId": "178",
    "tipo": "credito",
    "monto": 5000,
    "descripcion": "Cliente saldó parte de su deuda",
    "fecha": "2026-09-13T11:00:00.000Z",
    "estado": "confirmado",
    "creadoPor": "uid-emp-1",
    "creadoPorNombre": "Carlos",
    "confirmadoPor": "uid-admin",
    "confirmadoPorNombre": "Sami",
    "confirmadoEl": "2026-09-13T18:00:00.000Z"
  }
}
```

## Índices / consultas

- Se evitan índices compuestos: los filtros se arman con `where` y el
  orden se resuelve en memoria (fácil para el volumen de una agencia).
- La vista pública lee solo `clientes`, `agencias` y
  `movimientos_confirmados` (lectura abierta).