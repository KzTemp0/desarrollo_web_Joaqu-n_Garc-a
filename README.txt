# Tarea 1 - Desarrollo Web

## Descripción
La tarea consiste en un prototipo de app web de adopción de mascotas. La aplicación no guarda datos reales ni requiere servidor; se enfoca en mostrar las interfaces,
la validación de formularios y la navegación entre pantallas.

Incluye:
- Portada("portada.html"), con los últimos 5 avisos de adopción y redirecciones a las demas.
- Formulario("agregar.html"), para agregar un aviso, con validaciones hechas en JavaScript.
- Listado("listado.html"), muestra una lista de adopcion, donde al apretar una celda de la tabla te redirecciona a detalle.
- Detalle("detalle.html"), detalle de las adopciones.
- Estadísticas(`estadisticas.html`), muestra las estadisticas de la app web, con tres gráficos dibujados en SVG estático.

## Organización de carpetas
Tarea1
├── agregar.html
├── detalle.html
├── estadisticas.html
├── listado.html
├── portada.html
├── Css/
│ └── styles-css.css
├── Js/
│ ├── agregar-js.js
│ ├── detalle-js.js
│ ├── listado-js.js
│ └── script-js.js
└── Imagenes/
└── imagenes1, 2, 3, etc.

## Decisiones
- Mantener un diseño consistente en todas las páginas, reutilizando cabecera, menú y pie de página.
- Reutilizar un solo archivo de estilos ("Css/styles-css.css") para todos los HTML.
- Validar todo con JavaScript en "agregar-js.js" (no "required").
- Usar datos inventados, pero coherentes entre portada y listado, para que se note continuidad.
- En el detalle, se usó una página fija con un aviso de ejemplo.
- Los "gráficos" se implementaron con SVG simple, distintos en colores y valores a los de otros ejemplos.
- Ajustar tamaños de tablas y gráficos para que no se vean demasiado grandes o pequeños en la pantalla (llegaron a ser incomodos de ver).

## Cambios durante el desarrollo
- Inicialmente el formulario mostraba un "alert" y redirigía, lo cambie por el bloque de éxito en pantalla con botón para volver, como dice el enunciado.
- El menú desplegable fue descartado para mantener la navegación simple (botones fijos, no supe como implementarlo bien, lo veré mas adelante).
- En el gráfico de barras baje los valores de mayo para que no taparan la parte superior del SVG.

## Validaciones
- HTML y CSS revisados con el validador del W3C.
- Navegación entre páginas probada en local.