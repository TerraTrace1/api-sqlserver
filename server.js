const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

// ✅ CORS restringido (solo Lovable)
app.use(cors({
  origin: ['https://biodistri-quality.lovable.app']
}));

// ✅ Config segura con variables de entorno
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    instanceName: 'SQLEXPRESS',
    encrypt: false,
    trustServerCertificate: true
  }
};

// ✅ Ruta base
app.get('/', (req, res) => {
  res.send('✅ API segura funcionando');
});

// ✅ Endpoint protegido
app.get('/data', async (req, res) => {

  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    await sql.connect(config);

    const result = await sql.query(`
      SELECT TOP 10 
        CODIGO,
        NOMBRE,
        ESTADO
      FROM SAPROV
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno');
  }
});

app.listen(3000, () => {
  console.log('✅ API segura corriendo');
});
``