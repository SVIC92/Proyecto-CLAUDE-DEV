const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use(taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Ruta no encontrada', field: null } });
});

app.use(errorHandler);

module.exports = app;
