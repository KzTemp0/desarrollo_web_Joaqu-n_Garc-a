function abrirFoto(src) {
  const win = window.open("", "_blank", "width=820,height=680");
  if (!win) return; 

  win.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Foto ampliada</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin:0; background:#000; display:flex; align-items:center; justify-content:center; height:100vh; }
        .wrap { position:relative; }
        img { width:800px; height:600px; object-fit:contain; display:block; }
        .close-btn {
          position:absolute; top:10px; right:10px;
          background:#fff; color:#000; border:none; padding:8px 12px; cursor:pointer; border-radius:6px;
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <img src="${src}" alt="Foto ampliada" width="800" height="600">
        <button class="close-btn" onclick="window.close()">Cerrar</button>
      </div>
    </body>
    </html>
  `);
  win.document.close();
}