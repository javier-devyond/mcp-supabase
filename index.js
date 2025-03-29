// index.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Carga tus variables del archivo .env
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

// Middleware de autenticación por token
app.use((req, res, next) => {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ') || auth.split(' ')[1] !== AUTH_TOKEN) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    next();
  });

// Configura un cliente Axios para hablar con Supabase REST API
const supabaseClient = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_API_KEY,
    Authorization: `Bearer ${SUPABASE_API_KEY}`,
  },
});

// MCP Resource: /resources/users → Devuelve usuarios filtrados por query params
app.get('/resources/users', async (req, res) => {
    try {
      const query = req.query; // { pais: 'España', rol: 'inversor' }
  
      // Construimos un objeto con los filtros para Supabase
      const params = {
        select: '*',
        ...Object.fromEntries(
          Object.entries(query).map(([key, value]) => [`${key}`, `eq.${value}`])
        ),
      };
  
      const { data } = await supabaseClient.get('/users', { params });
  
      res.json({ resources: data });
    } catch (error) {
      console.error('❌ Error al obtener usuarios filtrados:', error.message);
      res.status(500).json({ error: 'Error al obtener usuarios filtrados' });
    }
  });
  

// Puerto local (3000 por defecto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP Supabase server corriendo en http://localhost:${PORT}`);
});
