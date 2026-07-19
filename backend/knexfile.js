const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// Shared SQLite config. DB_PATH lets us point at a mounted volume in Docker
// so the database survives container rebuilds.
const sqliteConfig = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_PATH || path.resolve(__dirname, './brokerless.sqlite')
  },
  useNullAsDefault: true,
  migrations: {
    directory: './migrations'
  }
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: sqliteConfig,
  production: sqliteConfig,
};
