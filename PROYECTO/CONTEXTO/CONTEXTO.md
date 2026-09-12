# Contexto del Proyecto

> Registro continuo de todo lo que hacemos en el proyecto. Actualizar después de cada sesión de trabajo.

## 2026-09-12 - Reinicio del proyecto

### Decisión
- Se descartó la idea original de una tienda en línea con dropshipping (no era lo más práctico).
- Se eliminó toda la documentación de ese proyecto (ETAPA-1..3 y el registro anterior).
- Se definirá un nuevo tipo de proyecto para el seminario.

### Qué se hizo
- `ETAPA-1-IDEA/` eliminada por completo (incluidos los wireframes de la tienda).
- `ETAPA-2-METODOLOGIA/` y `ETAPA-3-DISENO/` quedaron vacías (documentación eliminada).
- `CONTEXTO.md` reiniciado desde cero.
- `DOCUMENTACION/` se conserva intacta: es el material de la cátedra a seguir.

## 2026-09-12 - Nuevo proyecto definido: Fichas de Quiniela Digitales

### Decisión
- El proyecto reemplaza las fichas en papel de las agencias de quiniela por un sistema web.
- El empleado carga créditos/débitos, el administrador los confirma (quedan inmutables) y el cliente ve su planilla sin registrarse.
- Dos agencias, 2 empleados por agencia, control centralizado del dueño (admin).

### Qué se hizo
- Creada `ETAPA-1-IDEA/ETAPA-1-IDEA.md` con la documentación completa: idea, objetivos, alcance, 10 requerimientos funcionales, 6 no funcionales, MoSCoW y relato de la solución.
- Generado `ETAPA-1-IDEA.docx` con pandoc.
- Decisiones: planilla = historial de movimientos + saldo actual; identificación del cliente por apellido y nombre; stack React + Firebase (gratuito).

## 2026-09-12 - Flujo navegable y reglas definidas

### Qué se acordó
- **No hay registro en la web:** los usuarios los crea/deshabilita/modifica el admin desde su panel.
- **Empleado atado a su agencia:** al iniciar sesión entra directo; no puede ver la otra agencia.
- **Admin no atado:** al iniciar sesión elige agencia (178 o 362), **sin contraseña**.
- **Se descartó la contraseña de agencia** en código: con el login de Firebase alcanza.
- **Movimiento = fecha + descripción + monto + tipo (crédito/débito).**
- Movimiento nuevo nace **pendiente**; quien lo cargó puede **editar/eliminarlo** hasta que el admin confirme.
- **Firestore con 2 estructuras**: `movimientos_pendientes` y `movimientos_confirmados`. Al confirmar, el movimiento pasa a confirmados y queda **inmutable**.
- **Corrección de errores:** si un confirmado está mal, se carga un **nuevo movimiento** con descripción "Corrección: ..." que pasa por el mismo flujo. El original nunca se modifica.
- **Vista pública del cliente:** por apellido y nombre, sin distinguir mayúsculas, solo lectura.

### Qué se hizo
- Creado `PROYECTO/PLAN.md` con el recorrido navegable, roles, reglas de negocio, modelo de datos preliminar (colecciones Firestore) y próximos pasos.
- `ETAPA-1-IDEA.md` actualizada y `ETAPA-1-IDEA.docx` regenerado: se agregó la sección "Recorrido del usuario", se actualizaron RF-02/03/05/08/09 y se añadió RF-11 (corrección).

### Próximos pasos
- [ ] Wireframes de las pantallas.
- [ ] Etapa 2: metodología.
- [ ] Definir funciones adicionales del proyecto.