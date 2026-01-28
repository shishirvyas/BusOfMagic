// Database Configuration Module for Node.js
// This file reads credentials from environment variables
// Usage: const db = require('./db-config.js');

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// PostgreSQL Client Configuration
const dbConfig = {
  host: process.env.DB_HOST || process.env.NODE_DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.NODE_DB_PORT || '5432'),
  user: process.env.DB_USER || process.env.NODE_DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.NODE_DB_PASSWORD || '',
  database: process.env.DB_NAME || process.env.NODE_DB_DATABASE || 'postgres',
  ssl: false,
};

// Add SSL configuration if enabled
if (process.env.DB_SSL_ENABLED === 'true' && process.env.DB_SSL_CA_PATH) {
  const caPath = path.join(__dirname, process.env.DB_SSL_CA_PATH);
  if (fs.existsSync(caPath)) {
    dbConfig.ssl = {
      ca: fs.readFileSync(caPath).toString(),
      rejectUnauthorized: false,
    };
  }
}

module.exports = dbConfig;
