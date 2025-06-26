const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, 'quotes.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          logger.error('Error opening database:', err);
          reject(err);
        } else {
          logger.info('Connected to SQLite database');
          this.createTables()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS quotes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          author TEXT NOT NULL,
          stored_by TEXT NOT NULL,
          stored_by_id TEXT NOT NULL,
          channel TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      this.db.run(sql, (err) => {
        if (err) {
          logger.error('Error creating table:', err);
          reject(err);
        } else {
          logger.info('Quotes table ready');
          resolve();
        }
      });
    });
  }

  async addQuote(text, author, storedBy, storedById, channel) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO quotes (text, author, stored_by, stored_by_id, channel) VALUES (?, ?, ?, ?, ?)';
      
      this.db.run(sql, [text, author, storedBy, storedById, channel], function(err) {
        if (err) {
          logger.error('Error inserting quote:', err);
          reject(err);
        } else {
          logger.info(`Quote added with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      });
    });
  }

  async getRandomQuote() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1';
      
      this.db.get(sql, (err, row) => {
        if (err) {
          logger.error('Error getting random quote:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getLatestQuotes(limit = 5) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM quotes ORDER BY timestamp DESC LIMIT ?';
      
      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          logger.error('Error getting latest quotes:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getQuoteCount() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM quotes';
      
      this.db.get(sql, (err, row) => {
        if (err) {
          logger.error('Error getting quote count:', err);
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  async deleteQuote(quoteId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM quotes WHERE id = ?';
      
      this.db.run(sql, [quoteId], function(err) {
        if (err) {
          logger.error('Error deleting quote:', err);
          reject(err);
        } else {
          logger.info(`Quote deleted: ID ${quoteId}`);
          resolve(this.changes > 0);
        }
      });
    });
  }

  async getQuoteById(quoteId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM quotes WHERE id = ?';
      
      this.db.get(sql, [quoteId], (err, row) => {
        if (err) {
          logger.error('Error getting quote by ID:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = new Database();