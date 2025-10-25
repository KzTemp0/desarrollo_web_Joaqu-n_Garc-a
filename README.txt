# Tarea 1 - Desarrollo Web
Joaquin Garcia
## Descripción
El proyecto consiste en una **aplicación web para publicación y adopción de mascotas**, desarrollada de forma incremental a lo largo de tres tareas.

- En la **Tarea 1** se construyó el prototipo estático en HTML, CSS y JavaScript puro.
- En la **Tarea 2** se implementó la lógica de servidor con **Flask (Python)** y **MySQL** usando **SQLAlchemy**.
- En la **Tarea 3** se incorporaron funcionalidades dinámicas mediante **AJAX (fetch/Promesas)** y actualización asíncrona de datos.

---
Incluye:
### Portada
- Muestra los últimos 5 avisos reales obtenidos desde la base de datos.
- Cada fila es clickeable y redirige al detalle correspondiente.
- Incluye un botón para ver el listado completo.

### Listado
- Visualiza los avisos en una tabla paginada (5 filas por página).
- Permite filtrar por región, comuna, tipo de animal y orden ascendente/descendente.
- Botones Anterior / Siguiente con indicador de página actual.
- Cada aviso se puede abrir para ver su detalle.

### Agregar aviso
- Formulario con validaciones en cliente (JavaScript) y servidor (Python).
- Validaciones: región, comuna, nombre, email, cantidad, edad, tipo, unidad de edad, fecha mínima (+3 horas) y fotos (1–5).
- Campos opcionales: celular, sector y contactos adicionales (máx. 5).
- Al enviar, inserta registros en las tablas `aviso_adopcion`, `foto` y `contactar_por`, y guarda las fotos en `/static/uploads/`.
- Muestra mensaje de confirmación y redirige a la portada.

### Detalle
- Carga todos los datos desde la base de datos mediante el endpoint `/api/aviso/<id>`.
- Presenta todas las fotos con miniaturas clickeables y ampliación en un modal 800×600.
- Incluye una sección de comentarios cargados y enviados sin recargar la página.

### Comentarios 
- Se obtienen y envían de forma asíncrona con `fetch()`.
- Validaciones en cliente (mínimo 3 caracteres en nombre y 5 en texto) y en servidor.
- Se actualiza automáticamente el listado de comentarios tras enviar uno nuevo.

### Estadísticas 
- Página `/estadisticas` con tres gráficos dinámicos generados con **Highcharts**:
  1. Avisos por día (línea)
  2. Avisos por tipo (torta)
  3. Avisos por mes y tipo (barras agrupadas)
- Los datos se obtienen de tres endpoints Flask:
  - `/api/stats/por-dia`
  - `/api/stats/por-tipo`
  - `/api/stats/por-mes`
- Los SVG se sanitizan para cumplir con el validador W3C.

## Organización de carpetas
Tarea3:
Tarea1_App/
│
├── app/
│ ├── init.py # Configuración de Flask y SQLAlchemy
│ ├── models.py # Modelos: Region, Comuna, AvisoAdopcion, Foto, ContactarPor, Comentario
│ ├── routes.py # Rutas HTML y API (avisos, comentarios, estadísticas)
│ ├── templates/ # Archivos HTML (base, portada, listado, agregar, detalle, estadísticas)
│ └── static/
│ ├── Css/ # Estilos CSS
│ ├── Js/ # Scripts JS
│ └── uploads/ # Carpeta para guardar las fotos
│
├── run.py # Punto de entrada de la aplicación
├── requirements.txt # Dependencias de Python
└── README.md # Este archivo

## Decisiones
- Se mantuvo un diseño coherente y minimalista, con la misma cabecera, menú y pie en todas las páginas (heredadas desde `base.html`).
- Uso de variables CSS para colores principales, fondo y bordes.
- Se aplicaron colores más claros para mejorar la legibilidad.
- Se respetaron las validaciones W3C de HTML y CSS.
- Las fotos se almacenan en `/static/uploads/` y las rutas se normalizan para funcionar tanto en Windows como en Linux.
- Se utilizó la API moderna `fetch()` para todas las operaciones asíncronas.
- Todos los campos y errores se gestionan con mensajes claros y controles accesibles.

## Dificultades y soluciones
- **Integración Flask + formularios:** se resolvieron problemas de nombres de campo y carga de imágenes adaptando `secure_filename()` y el directorio `UPLOAD_FOLDER`.
- **Errores en fechas y validaciones:** se agregó validación de fecha mínima (actual + 3 h) tanto en cliente como servidor.
- **Carga de comentarios y estadísticas:** se implementó inicialización asincrónica y control de errores en `fetch()`.
- **Validación HTML Highcharts:** se eliminaron atributos no válidos (`text-align`, `transform-origin`) de los SVG generados.
