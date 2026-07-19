const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Allow the DB location to be overridden (e.g. a mounted volume in Docker)
// so data survives container rebuilds. Falls back to the repo-local file.
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../brokerless.sqlite');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys in SQLite
db.run('PRAGMA foreign_keys = ON');

class SQLiteConnection {
  async beginTransaction() {
    await this.query('BEGIN TRANSACTION');
  }

  async commit() {
    await this.query('COMMIT');
  }

  async rollback() {
    await this.query('ROLLBACK');
  }

  release() {
    // No-op for sqlite single connection simulation
  }

  async query(sql, params = []) {
    let normalizedSql = sql;
    
    // Convert ON DUPLICATE KEY UPDATE to SQLite-compatible ON CONFLICT
    if (/ON DUPLICATE KEY UPDATE/i.test(sql)) {
      normalizedSql = sql.replace(
        /ON DUPLICATE KEY UPDATE.*/i,
        'ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value'
      );
    }

    return new Promise((resolve, reject) => {
      const isSelect = /^\s*select/i.test(normalizedSql);
      if (isSelect) {
        db.all(normalizedSql, params, (err, rows) => {
          if (err) return reject(err);
          resolve([rows, null]);
        });
      } else {
        db.run(normalizedSql, params, function(err) {
          if (err) return reject(err);
          resolve([{ insertId: this.lastID, affectedRows: this.changes }, null]);
        });
      }
    });
  }
}

const singleConnection = new SQLiteConnection();

const pool = {
  query: (sql, params) => singleConnection.query(sql, params),
  execute: (sql, params) => singleConnection.query(sql, params),
  getConnection: async () => singleConnection,
  end: () => new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  })
};

module.exports = pool;
