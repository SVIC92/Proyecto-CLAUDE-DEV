require('dotenv').config();

const REQUIRED_VARS = ['SUPABASE_URL', 'SUPABASE_KEY'];

for (const name of REQUIRED_VARS) {
  if (!process.env[name]) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example a .env y completa los valores.`
    );
  }
}

module.exports = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  port: process.env.PORT || 3000,
};
