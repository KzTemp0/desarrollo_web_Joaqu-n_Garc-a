function q(k){ return new URLSearchParams(location.search).get(k); }

const $f = document.getElementById("detalle-foto");
const $n = document.getElementById("detalle-nombre");
const $t = document.getElementById("detalle-tipo");
const $e = document.getElementById("detalle-edad");
const $r = document.getElementById("detalle-region");
const $c = document.getElementById("detalle-comuna");
const $s = document.getElementById("detalle-sector");
const $m = document.getElementById("detalle-email");
const $p = document.getElementById("detalle-celular");
const $d = document.getElementById("detalle-descripcion");

const $gal = document.getElementById("galeria");
function thumb(src){
  const img = document.createElement("img");
  img.src = src;
  img.width = 120; img.height = 90; img.loading = "lazy";
  img.style.cursor = "pointer";
  img.addEventListener("click", () => openModal(src));
  return img;
}

// Modal simple 320x240 -> 800x600
const $modal = document.getElementById("modal");
const $modalImg = document.getElementById("modal-img");
const $cerrar = document.getElementById("cerrar");
function openModal(src){ $modalImg.src = src; $modal.style.display = "block"; }
$cerrar.addEventListener("click", () => { $modal.style.display = "none"; });

async function cargar(){
  const id = q("id");
  const r = await fetch(`/api/aviso/${id}`);
  const a = await r.json();
  if($f && a.fotos && a.fotos.length) $f.src = a.fotos[0];
  if($n) $n.textContent = a.nombre_contacto || "";
  if($t) $t.textContent = a.tipo || "";
  if($e) $e.textContent = (a.edad || "") + " " + (a.unidad_edad || "");
  if($r) $r.textContent = a.region_nombre || "";
  if($c) $c.textContent = a.comuna_nombre || "";
  if($s) $s.textContent = a.sector || "";
  if($m) $m.textContent = a.email || "";
  if($p) $p.textContent = a.celular || "";
  if($d) $d.textContent = a.descripcion || "";
  $gal.innerHTML = "";
  (a.fotos || []).forEach(src => $gal.appendChild(thumb(src)));
}

// Comentarios (T3)
const $form = document.getElementById("form-comentario");
const $nom  = document.getElementById("c-nombre");
const $txt  = document.getElementById("c-texto");
const $ok   = document.getElementById("ok-msg");
const $ul   = document.getElementById("lista-comentarios");

function pintarComentarios(arr){
  $ul.innerHTML = "";
  arr.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${c.fecha} – ${c.nombre}:</strong> ${c.texto}`;
    $ul.appendChild(li);
  });
}

async function cargarComentarios(){
  const id = parseInt(q("id"));
  const r = await fetch(`/api/comentarios?aviso_id=${id}`);
  const data = await r.json();
  pintarComentarios(Array.isArray(data) ? data : []);
}

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = parseInt(q("id"));
  const nombre = ($nom.value || "").trim();
  const texto = ($txt.value || "").trim();
  if(nombre.length < 3 || nombre.length > 80){ alert("Nombre inválido"); return; }
  if(texto.length < 5){ alert("Comentario muy corto"); return; }
  const r = await fetch("/api/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aviso_id: id, nombre, texto })
  });
  if(!r.ok){ alert("No se pudo guardar el comentario"); return; }
  $ok.style.display = "inline";
  $nom.value = ""; $txt.value = "";
  await cargarComentarios();
  setTimeout(() => { $ok.style.display = "none"; }, 2000);
});

cargar().then(cargarComentarios);
