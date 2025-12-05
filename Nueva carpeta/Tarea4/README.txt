#Tarea 5 - Desarrollo Web

Joaquin Garcia

##Descripción

Este proyecto corresponde a la extensión de la aplicación desarrollada en tareas anteriores,
ahora incorporando funcionalidades administrativas y de auditoría, solicitadas en el enunciado de la Tarea 5.

El sistema está construido en Java 25, utilizando Spring Boot, Spring Security, Thymeleaf y MySQL.
La base de datos utilizada es la misma de tareas previas (tabla aviso_adopcion, comuna, foto, etc.), 
pero en esta entrega se añaden nuevas vistas, controladores y lógica relacionadas con la gestión de fotografías
y mensajes de log.

##Cambios incorporados en esta entrega:

-Visualización y administración de fotos asociadas a avisos.

-Marcado de fotos como eliminadas, registrando un motivo.

-Creación automática de entradas en una tabla de log.

-Restricción de acceso mediante autenticación con usuario administrativo.

-Página dedicada para revisar los mensajes registrados en el log.

##Funcionalidades
Administración de fotos (/t5-admin-fotos)

-Vista tipo galería que muestra todas las fotos no eliminadas.

Cada foto incluye:

-Fecha del aviso asociado.

-Comuna correspondiente.

-Email de contacto.

-Imagen referenciada mediante su archivo físico.

Botón "Marcar como eliminada", que:

-Solicita un motivo entre 5 y 200 caracteres.

-Envía un POST con el motivo al backend.

-Actualiza el registro marcando eliminada = 1.

-Agrega una entrada descriptiva en la tabla log.

Seguridad

Se añade Spring Security para proteger las rutas administrativas.

Solo el usuario:

usuario: cc5002

clave: examen
puede ingresar a /t5-admin-fotos y /mensajes-log.

##Base de datos

Se utiliza la misma base de datos que en tareas anteriores.

Además, se incorpora una nueva tabla log indicada en el enunciado.


Abrir en el navegador:

http://localhost:8080


Para acceder a las páginas administrativas:

http://localhost:8080/t5-admin-fotos
http://localhost:8080/mensajes-log


Ingresar credenciales:
Usuario: cc5002
Contraseña: examen
