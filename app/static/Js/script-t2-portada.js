const tbody = document.querySelector("#tabla-portada tbody");

function fila(a){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${a.fecha_publicacion ? new Date(a.fecha_publicacion).toLocaleString() : ""}</td>
    <td>${a.comuna_nombre || ""}</td>
    <td>${a.sector || ""}</td>
    <td>${a.cantidad ?? ""}</td>
    <td>${(a.tipo || "")} ${a.edad ? `${a.edad} ${a.unidad_edad || ""}` : ""}</td>
    <td>${a.foto_url ? `<img src="${a.foto_url}" alt="foto" width="120" height="90">` : ""}</td>`;
  tr.addEventListener("click", () => { location.href = `/detalle?id=${a.id}`; });
  return tr;
}

async function cargar(){
  const r = await fetch(`/api/avisos?limit=5&order=desc`);
  const data = await r.json();
  tbody.innerHTML = "";
  (Array.isArray(data) ? data : []).forEach(a => tbody.appendChild(fila(a)));
}

cargar();
