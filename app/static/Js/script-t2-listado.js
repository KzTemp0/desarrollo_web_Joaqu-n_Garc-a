const $region = document.getElementById("region");
const $comuna = document.getElementById("comuna");
const $tipo = document.getElementById("tipo");
const $orden = document.getElementById("orden");
const $form = document.getElementById("filtros");
const $tbody = document.querySelector("#tabla-listado tbody");
const $prev = document.getElementById("prev");
const $next = document.getElementById("next");
const $info = document.getElementById("info");

let state = { page: 1, per_page: 5, total: 0 };

function fila(a){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${a.fecha_publicacion ? new Date(a.fecha_publicacion).toLocaleString() : ""}</td>
    <td>${a.fecha_entrega ? new Date(a.fecha_entrega).toLocaleString() : ""}</td>
    <td>${a.comuna_nombre || ""}</td>
    <td>${a.sector || ""}</td>
    <td>${a.cantidad ?? ""}</td>
    <td>${(a.tipo || "")} ${a.edad ? `${a.edad} ${a.unidad_edad || ""}` : ""}</td>
    <td>${a.nombre_contacto || ""}</td>
    <td>${a.foto_url ? `<img src="${a.foto_url}" alt="foto" width="120" height="90">` : ""}</td>`;
  tr.addEventListener("click", () => { location.href = `/detalle?id=${a.id}`; });
  return tr;
}

async function cargarRegiones(){
  const r = await fetch("/api/regiones");
  const regiones = await r.json();
  $region.innerHTML = `<option value="">Todas</option>` + regiones.map(x => `<option value="${x.id}">${x.nombre}</option>`).join("");
}

async function cargarComunas(regionId){
  if(!regionId){
    $comuna.innerHTML = `<option value="">Todas</option>`;
    return;
  }
  const r = await fetch(`/api/comunas?region_id=${encodeURIComponent(regionId)}`);
  const comunas = await r.json();
  $comuna.innerHTML = `<option value="">Todas</option>` + comunas.map(x => `<option value="${x.id}">${x.nombre}</option>`).join("");
}

async function consultar(){
  const params = new URLSearchParams();
  params.set("page", state.page);
  params.set("per_page", state.per_page);
  if($region.value) params.set("region_id", $region.value);
  if($comuna.value) params.set("comuna_id", $comuna.value);
  if($tipo.value) params.set("tipo", $tipo.value);
  if($orden.value) params.set("order", $orden.value);

  const r = await fetch(`/api/avisos?${params.toString()}`);
  const data = await r.json();
  const items = Array.isArray(data.items) ? data.items : [];

  state.total = data.total || 0;
  $tbody.innerHTML = "";
  items.forEach(a => $tbody.appendChild(fila(a)));

  const totalPages = Math.max(1, Math.ceil(state.total / state.per_page));
  $prev.disabled = state.page <= 1;
  $next.disabled = state.page >= totalPages;
  $info.textContent = `Página ${state.page} de ${totalPages}`;
}

$region.addEventListener("change", e => { cargarComunas(e.target.value); });
$form.addEventListener("submit", e => { e.preventDefault(); state.page = 1; consultar(); });
$prev.addEventListener("click", () => { state.page = Math.max(1, state.page - 1); consultar(); });
$next.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(state.total / state.per_page));
  state.page = Math.min(totalPages, state.page + 1);
  consultar();
});

cargarRegiones().then(() => consultar());
