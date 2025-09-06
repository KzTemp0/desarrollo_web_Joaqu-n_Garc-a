const comunasPorRegion = {
  rm: ["Santiago", "Ñuñoa", "Providencia", "La Florida", "Maipú", "Las Condes"],
  v: ["Valparaíso", "Viña del Mar", "Quilpué"],
  viii: ["Concepción", "Talcahuano", "San Pedro de la Paz"]
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isMovil = (v) => v === "" || /^\+\d{3}\.\d{8,10}$/.test(v); 
const isIntGE1 = (v) => Number.isInteger(Number(v)) && Number(v) >= 1;

document.addEventListener("DOMContentLoaded", () => {
  const $region = document.getElementById("region");
  const $comuna = document.getElementById("comuna");
  const $contactarPor = document.getElementById("contactar-por");
  const $contactoExtra = document.getElementById("contacto-extra");
  const $contactoId = document.getElementById("contacto-id");
  const $fechaEntrega = document.getElementById("fecha-entrega");
  const $hintFecha = document.getElementById("hint-fecha");
  const $btnOtraFoto = document.getElementById("btn-otra-foto");
  const $fotosWrapper = document.getElementById("fotos-wrapper");
  const $form = document.getElementById("form-aviso");
  const $errores = document.getElementById("errores");

  const ahora = new Date();
  const t3 = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const prefill =
    `${t3.getFullYear()}-${pad(t3.getMonth() + 1)}-${pad(t3.getDate())}` +
    `T${pad(t3.getHours())}:${pad(t3.getMinutes())}`;
  $fechaEntrega.value = prefill;
  $hintFecha.textContent = `Debe ser ≥ ${prefill}`;

  $region.addEventListener("change", () => {
    const region = $region.value;
    $comuna.innerHTML = "";
    if (!region || !comunasPorRegion[region]) {
      $comuna.disabled = true;
      $comuna.innerHTML = `<option value="">Seleccione región primero...</option>`;
      return;
    }
    $comuna.disabled = false;
    const opts = comunasPorRegion[region]
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
    $comuna.innerHTML = `<option value="">Seleccione...</option>${opts}`;
  });

  $contactarPor.addEventListener("change", () => {
    const seleccionadas = Array.from($contactarPor.selectedOptions).map(o => o.value);
    if (seleccionadas.length > 0) {
      $contactoExtra.style.display = "block";
    } else {
      $contactoExtra.style.display = "none";
      $contactoId.value = "";
    }
  });

  $btnOtraFoto.addEventListener("click", () => {
    const actuales = $fotosWrapper.querySelectorAll('input[type="file"]').length;
    if (actuales >= 5) {
      alert("Máximo 5 fotos.");
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.name = "foto";
    input.accept = "image/*";
    $fotosWrapper.appendChild(document.createElement("br"));
    $fotosWrapper.appendChild(input);
  });

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    $errores.textContent = "";
    const errores = [];

    const region = $region.value.trim();
    const comuna = $comuna.value.trim();
    const sector = document.getElementById("sector").value.trim();
    if (!region) errores.push("Región es obligatoria.");
    if (!comuna) errores.push("Comuna es obligatoria.");
    if (sector.length > 100) errores.push("Sector: largo máximo 100.");

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const cel = document.getElementById("cel").value.trim();
    const redes = Array.from($contactarPor.selectedOptions).map(o => o.value);
    const idExtra = $contactoId.value.trim();
    if (nombre.length < 3 || nombre.length > 200) errores.push("Nombre debe tener entre 3 y 200 caracteres.");
    if (!email || !isEmail(email) || email.length > 100) errores.push("Email obligatorio, formato válido, máx. 100.");
    if (!isMovil(cel)) errores.push("Celular debe ser +NNN.NNNNNNNN (o déjelo vacío).");
    if (redes.length > 5) errores.push("Puede seleccionar hasta 5 medios de contacto.");
    if (redes.length > 0 && (idExtra.length < 4 || idExtra.length > 50)) {
      errores.push("ID/URL de contacto debe tener entre 4 y 50 caracteres.");
    }

    const tipo = document.getElementById("tipo").value.trim();
    const cantidad = document.getElementById("cantidad").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const unidad = document.getElementById("unidad").value.trim();
    if (!tipo) errores.push("Debe seleccionar tipo (gato o perro).");
    if (!isIntGE1(cantidad)) errores.push("Cantidad debe ser entero ≥ 1.");
    if (!isIntGE1(edad)) errores.push("Edad debe ser entero ≥ 1.");
    if (!unidad) errores.push("Debe seleccionar la unidad de edad.");

    const fechaEntrega = document.getElementById("fecha-entrega").value.trim();
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fechaEntrega)) {
      errores.push("Fecha de entrega debe tener formato yyyy-mm-ddThh:mm.");
    } else {
      const f = new Date(fechaEntrega);
      const min = new Date(prefill);
      if (isNaN(f.getTime()) || f < min) {
        errores.push("Fecha de entrega debe ser mayor o igual al prellenado.");
      }
    }

    const fotos = $fotosWrapper.querySelectorAll('input[type="file"]');
    if (fotos.length === 0) errores.push("Debe agregar al menos una foto.");
    if (fotos.length > 5) errores.push("Máximo 5 fotos permitidas.");

    let algunaConArchivo = false;
    fotos.forEach(i => { if (i.files && i.files.length > 0) algunaConArchivo = true; });
    if (!algunaConArchivo) errores.push("Adjunte al menos un archivo de imagen.");

    if (errores.length > 0) {
      $errores.innerHTML = errores.map(e => `• ${e}`).join("<br>");
      return;
    }

    const ok = confirm("¿Está seguro que desea agregar este aviso de adopción?");
    if (ok) {
        
        const form = document.getElementById("form-aviso");
        const exito = document.getElementById("exito");
        form.style.display = "none";
        exito.style.display = "block";
        exito.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
    
    }
  });
});