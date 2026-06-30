require('dotenv').config();
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

// ──────────────────────────────────────────────
// 1. LISTADO DE PRODUCTOS (todos)
// ──────────────────────────────────────────────
app.get('/productos', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT
        P.CODPROD    AS CODIGO,
        P.DESCRIP    AS PRODUCTO,
        I.DESCRIP    AS CATEGORIA,
        P.MARCA      AS MARCA,
        P.UNIDAD     AS UNIDAD,
        P.PRECIO1    AS PRECIO,
        P.COSTACT    AS COSTO,
        P.ACTIVO     AS ACTIVO
      FROM SAPROD P
      JOIN SAINSTA I ON (P.CODINST = I.CodInst)
      JOIN SAEXIS E ON (P.CodProd = E.CodProd)
      WHERE E.CodUbic = '001'
        AND P.ACTIVO = 1
      ORDER BY P.DESCRIP;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// ──────────────────────────────────────────────
// 2. DETALLE DE UN PRODUCTO
// ──────────────────────────────────────────────
app.get('/productos/:codigo', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT
        P.CODPROD    AS CODIGO,
        P.DESCRIP    AS PRODUCTO,
        I.DESCRIP    AS CATEGORIA,
        P.MARCA      AS MARCA,
        P.UNIDAD     AS UNIDAD,
        P.PRECIO1    AS PRECIO,
        P.COSTACT    AS COSTO,
        P.ACTIVO     AS ACTIVO
      FROM SAPROD P
      JOIN SAINSTA I ON (P.CODINST = I.CodInst)
      JOIN SAEXIS E ON (P.CodProd = E.CodProd)
      WHERE P.CODPROD = '${req.params.codigo}'
        AND E.CodUbic = '001'
    `);
    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar producto' });
  }
});

// ──────────────────────────────────────────────
// 3. PROVEEDORES
// ──────────────────────────────────────────────
app.get('/proveedores', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT
        CodProv AS CODIGO,
        Descrip AS NOMBRE,
        Activo  AS ESTADO
      FROM SAPROV
      WHERE Activo = 1
      ORDER BY Descrip;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar proveedores' });
  }
});

// ──────────────────────────────────────────────
// 4. CLIENTES
// ──────────────────────────────────────────────
app.get('/clientes', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT
        CodClie  AS CODIGO,
        Descrip  AS NOMBRE,
        Direcc   AS DIRECCION,
        Telefon  AS TELEFONO,
        Activo   AS ESTADO
      FROM SACLIE
      WHERE Activo = 1
      ORDER BY Descrip;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar clientes' });
  }
});

// ──────────────────────────────────────────────
// 5. INICIO DEL SERVIDOR
// ──────────────────────────────────────────────
app.listen(3000, () => {
  console.log('✅ API segura corriendo en puerto 3000');
});
