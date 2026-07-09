const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`Task manager API escuchando en http://localhost:${env.port}`);
});
