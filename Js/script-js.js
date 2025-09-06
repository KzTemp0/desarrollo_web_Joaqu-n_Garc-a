const recentAdoptions = [
    {
        date: '2025-08-18<br>12:00',
        comuna: 'Santiago',
        sector: 'Beauchef 850, terraza',
        quantity: '1',
        type: 'gato',
        age: '2 meses',
        photo: 'Imagenes/gato1.jfif'
    },
    {
        date: '2025-08-17<br>19:00',
        comuna: 'Ñuñoa',
        sector: 'Plaza',
        quantity: '3',
        type: 'perros',
        age: '2 meses',
        photo: 'Imagenes/perro1.jpg'
    },
    {
        date: '2025-08-17<br>18:00',
        comuna: 'Santiago',
        sector: 'Parque O\'higgins',
        quantity: '2',
        type: 'gatos',
        age: '1 mes',
        photo: 'Imagenes/gato2.webp'
    },
    {
        date: '2025-08-16<br>14:30',
        comuna: 'Las Condes',
        sector: 'Av. Kennedy 5600',
        quantity: '1',
        type: 'perro',
        age: '6 meses',
        photo: 'Imagenes/perro2.webp'
    },
    {
        date: '2025-08-15<br>09:15',
        comuna: 'Providencia',
        sector: 'Metro Los Leones',
        quantity: '4',
        type: 'gatos',
        age: '3 meses',
        photo: 'Imagenes/gato3.jpeg'
    }
];

function loadRecentAdoptions() {
    const tbody = document.getElementById('recent-adoptions-body');
    
    recentAdoptions.forEach(adoption => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="date-cell">${adoption.date}</td>
            <td class="location">${adoption.comuna}</td>
            <td class="location">${adoption.sector}</td>
            <td style="text-align: center; font-weight: bold;">${adoption.quantity}</td>
            <td class="pet-type">${adoption.type}<br><small style="color: #666;">${adoption.age}</small></td>
            <td class="photo-cell">
                <img src="${adoption.photo}" alt="Mascota en adopción" class="pet-photo" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMzAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCA2IDRDOS43OTA5IDQgOCA1Ljc5MDkgOCA4QzggMTAuMjA5MSA5Ljc5MDkgMTIgMTIgMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDMwIDYgMTYuMzMgNiAxNkMxLjMzIDIwIDEuMzMgMjAgMTIgMjBDMTguNjcgMjAgMjIgMTYuMzMgMTggMTZDMTggMTYuMzMgMTQuNjcgMTQgMTIgMTRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function navigateToPage(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', loadRecentAdoptions);