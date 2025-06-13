const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Carpeta para guardar archivos subidos
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Servir archivos estáticos desde 'public' y carpeta 'uploads'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

// Ruta explícita para servir index.html (página de inicio)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para subir archivos
app.post('/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) return res.status(400).send('No se subió ningún archivo');

  const filename = req.file.filename;
  const fileUrl = `/uploads/${filename}`;
  const isImage = req.file.mimetype.startsWith('image/');

  res.send(`
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Archivo Subido</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f0f0f0;
            padding: 40px;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            display: inline-block;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          img {
            max-width: 400px;
            margin-top: 20px;
          }
          a.button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
          a.button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Archivo subido correctamente</h1>
          <p><strong>Nombre:</strong> ${filename}</p>
          ${isImage ? `<img src="${fileUrl}" alt="Imagen subida" />` : `<p><a href="${fileUrl}" target="_blank">Ver archivo</a></p>`}
          <br />
          <a class="button" href="/">Subir otro archivo</a>
        </div>
      </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
