document.addEventListener("DOMContentLoaded", function(){
  const $form = document.getElementById("form-agregar");
  const $region = document.getElementById("region");
  const $comuna = document.getElementById("comuna");
  const $sector = document.getElementById("sector");
  const $nombre = document.getElementById("nombre");
  const $email = document.getElementById("email");
  const $cel = document.getElementById("celular");
  const $tipo = document.getElementById("tipo");
  const $cant = document.getElementById("cantidad");
  const $edad = document.getElementById("edad");
  const $unidad = document.getElementById("unidad_edad");
  const $fecha = document.getElementById("fecha_entrega");
  const $desc = document.getElementById("descripcion");
  const $fotosWrapper = document.getElementById("fotos-wrapper");
  const $btnFoto = document.getElementById("agregar-foto");

  function setMinFecha(){
    // T1: prellenado = ahora + 3 horas. :contentReference[oaicite:6]{index=6}
    const now = new Date(Date.now() + 3 * 3600 * 1000);
    const iso = now.toISOString().slice(0,16); // yyyy-mm-ddThh:mm
    $fecha.min = iso;
    if(!$fecha.value) $fecha.value = iso;
  }

  async function cargarRegiones(){
    const r = await fetch("/api/regiones");
    const regiones = await r.json();
    $region.innerHTML = regiones.map(x => `<option value="${x.id}">${x.nombre}</option>`).join("");
    if(regiones.length) {
      $region.value = regiones[0].id;
      cargarComunas($region.value);
    }
  }

  async function cargarComunas(regionId){
    const r = await fetch(`/api/comunas?region_id=${encodeURIComponent(regionId)}`);
    const comunas = await r.json();
    $comuna.innerHTML = comunas.map(x => `<option value="${x.id}">${x.nombre}</option>`).join("");
  }

  function nuevaFoto(){
    const input = document.createElement("input");
    input.type = "file";
    input.name = "fotos";
    input.accept = "image/*";
    return input;
  }

  if($btnFoto){
    $btnFoto.addEventListener("click", () => {
      const actuales = [...$fotosWrapper.querySelectorAll('input[type="file"]')].length;
      if(actuales >= 5) return;
      $fotosWrapper.appendChild(nuevaFoto());
    });
  }

  if($region){
    $region.addEventListener("change", (e) => cargarComunas(e.target.value));
  }

  function validar(){
    const errors = {};
    if(!$region.value) errors.region = "obligatorio";
    if(!$comuna.value) errors.comuna = "obligatorio";
    if(!$nombre.value || $nombre.value.length < 3 || $nombre.value.length > 200) errors.nombre = "largo";
    if(!$email.value || $email.value.length > 100 || !$email.value.includes("@") || !$email.value.includes(".")) errors.email = "formato";
    if($cel.value){
      const ok = $cel.value.startsWith("+") && $cel.value.includes(".") && /^[\d+\.]+$/.test($cel.value);
      if(!ok) errors.celular = "formato";
    }
    if(!$tipo.value) errors.tipo = "opcion";
    if(!Number.isInteger(parseInt($cant.value)) || parseInt($cant.value) < 1) errors.cantidad = "entero";
    if(!Number.isInteger(parseInt($edad.value)) || parseInt($edad.value) < 1) errors.edad = "entero";
    if(!$unidad.value) errors.unidad_edad = "opcion";
    const fotos = [...$fotosWrapper.querySelectorAll('input[type="file"]')];
    if(fotos.length < 1) errors.fotos = "min";
    if(Object.keys(errors).length) {
      alert("Revisa el formulario: " + JSON.stringify(errors));
      return false;
    }
    return true;
  }

  if($form){
    document.getElementById("btn-enviar").addEventListener("click", async () => {
      if(!validar()) return;

      // Armar FormData con todos los campos y contactos opcionales (máx 5). T1/T2. :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}
      const fd = new FormData($form);
      // recopilar contactos
      const $contactos = document.getElementById("contactos");
      const filas = $contactos ? [...$contactos.querySelectorAll("div")] : [];
      const pares = [];
      for(const fila of filas){
        const sel = fila.querySelector('select[name="cp_nombre"]');
        const inp = fila.querySelector('input[name="cp_identificador"]');
        if(sel && inp && sel.value && inp.value && inp.value.length >= 4 && inp.value.length <= 50){
          fd.append("cp_nombre", sel.value);
          fd.append("cp_identificador", inp.value);
          pares.push(1);
        }
      }
      if(pares.length > 5){
        alert("Máximo 5 contactos.");
        return;
      }

      try{
        const resp = await fetch("/api/avisos", { method: "POST", body: fd });
        if(!resp.ok){
          const t = await resp.text();
          alert("Error al enviar: " + t);
          return;
        }
        alert("Hemos recibido la información de adopción, muchas gracias y suerte!");
        location.href = "/";
      }catch(err){
        alert("No se pudo enviar. Revisa la conexión o la consola.");
      }
    });
  }

  setMinFecha();
  cargarRegiones();
  $fotosWrapper.appendChild(nuevaFoto());
});
