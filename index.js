const path = require('path');
const express = require('express');
const { dbConnection } = require('./db/config');
require('dotenv').config();
const cors = require('cors');

// Servidor express
const app = express();

// BD
dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
