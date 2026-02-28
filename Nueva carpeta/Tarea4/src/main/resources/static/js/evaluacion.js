document.addEventListener("DOMContentLoaded", function () {
  var botones = document.querySelectorAll(".btn-evaluar");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      var avisoId = this.getAttribute("data-aviso-id");

      var input = window.prompt("Ingrese una nota entre 1 y 7:");
      if (input === null) {
        return;
      }

      var valor = Number(input);

      if (!Number.isInteger(valor) || valor < 1 || valor > 7) {
        window.alert("La nota debe ser un número entero entre 1 y 7.");
        return;
      }

      fetch("/api/avisos/" + encodeURIComponent(avisoId) + "/notas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ valor: valor })
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Error al guardar la nota.");
          }
          return response.json();
        })
        .then(function (data) {
          var promedio = data.promedio;
          var selector = '.nota-promedio[data-aviso-id="' + avisoId + '"]';
          var celda = document.querySelector(selector);

          if (!celda) {
            return;
          }

          if (isNaN(promedio)) {
            celda.textContent = "-";
          } else {
            celda.textContent = promedio.toFixed(1);
          }
        })
        .catch(function (error) {
          window.alert(error.message);
        });
    });
  });
});
