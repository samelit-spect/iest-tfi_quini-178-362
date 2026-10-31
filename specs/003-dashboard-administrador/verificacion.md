# Verificación 003

## Checklist contra spec
- [x] UCF-020: el admin ve los pendientes por confirmar agrupados por agencia.
- [x] UCF-021: se muestran los movimientos confirmados del día por agencia.
- [x] UCF-022: se muestran totales y resumen (clientes, pendientes, créditos, débitos y saldo neto).
- [x] URN-020: solo el rol admin accede a `/admin/dashboard`.
- [x] Solo admin.
- [x] Datos correctos.

## Resultado
Estado: Verificado

## Evidencia
- `src/App.tsx`: ruta anidada `/admin` con `/admin/dashboard`.
- `src/pages/admin/Admin.tsx`: redirige a un usuario que no sea admin.
- `src/components/RutaProtegida.tsx`: exige sesión activa y perfil habilitado.
- `src/pages/admin/Dashboard.tsx`: consulta agencias, clientes, pendientes y confirmados, y filtra por la fecha del día.
- `firestore.rules`: lectura de pendientes y confirmados restringida por rol; escritura solo admin.
