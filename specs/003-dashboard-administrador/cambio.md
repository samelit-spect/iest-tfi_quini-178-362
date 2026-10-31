# Cambio 003

## Problema detectado
El dashboard debía ser exclusivo del administrador y no exponer datos de otras agencias a un empleado.

## Corrección aplicada
- La ruta `/admin/dashboard` queda dentro del layout `Admin`, que redirige a quien no tenga rol admin.
- `RutaProtegida` exige sesión activa y perfil habilitado.
- Las reglas de Firestore limitan la lectura según el rol y la agencia.

## Evidencia
- `src/pages/admin/Admin.tsx`: guard de rol admin.
- `src/components/RutaProtegida.tsx`: control de sesión y perfil activo.
- `src/App.tsx`: ruta anidada del dashboard.
- `firestore.rules`: permisos de lectura por rol.
