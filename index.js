const express = require('express');
const cors = require('cors');
const path =  require('path');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// 1. Crear el servidor/app de express
const app = express();

// 7. Conexión DB
dbConnection();

// 6. path a la vista (opcional)
app.use(express.static('public'));

// 4. Cors
app.use(cors());

// 5. lectura y parseo del body
app.use(express.json());

// 3. Configuración de rutas
app.use('/api/auth', require('./routes/auth'));

// Manejo de las demas rutas, montando front en back
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

// 2. Levantar la aplicación
app.listen(process.env.PORT, () => {
  console.log(`Server corriendo en el puerto ${process.env.PORT}`);
});