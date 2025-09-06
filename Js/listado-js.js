const contactosListado = ["Camila Navarrete", "Juan López", "Ana Torres", "Pedro Ramírez", "Carla Gómez"];
const fechasEntrega = [
  "2025-08-21 12:00",
  "2025-08-20 19:00",
  "2025-08-20 18:00",
  "2025-08-18 14:30",
  "2025-08-17 09:15"
];

const fotosPorAviso = [1, 1, 1, 1, 1];

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("listado-body");

  if (!Array.isArray(recentAdoptions) || recentAdoptions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No hay avisos disponibles.</td></tr>`;
    return;
  }

  recentAdoptions.forEach((aviso, i) => {
    const row = document.createElement("tr");
    const fechaPub = String(aviso.date).replace(/<br\s*\/?>/i, " ");

    row.innerHTML = `
      <td>${fechaPub}</td>
      <td>${fechasEntrega[i] || "Por definir"}</td>
      <td>${aviso.comuna}</td>
      <td>${aviso.sector}</td>
      <td><strong>${aviso.quantity}</strong> ${aviso.type} · ${aviso.age}</td>
      <td>${contactosListado[i] || "Contacto"}</td>
      <td>${fotosPorAviso[i] ?? 1}</td>
    `;

    row.addEventListener("click", () => {
      window.location.href = "detalle.html";
    });

    tbody.appendChild(row);
  });
});