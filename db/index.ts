// import 'dotenv/config';
// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import ws from "ws";
// import * as schema from "@shared/schema";

// // This is the correct way neon config - DO NOT change this
// neonConfig.webSocketConstructor = ws;

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool, schema });


import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 3, // Reduced for Render free tier
  min: 2, // Keep 2 connections alive to reduce reconnection frequency
  idleTimeoutMillis: 120000, // 2 minutes - longer idle time
  connectionTimeoutMillis: 15000, // 15 seconds
  acquireTimeoutMillis: 15000, // 15 seconds
  createTimeoutMillis: 15000, // 15 seconds
  destroyTimeoutMillis: 5000, // 5 seconds
  reapIntervalMillis: 10000, // 10 seconds - less frequent cleanup
  createRetryIntervalMillis: 1000, // 1 second
  keepAlive: true, // Enable keep-alive to maintain connections
  allowExitOnIdle: false, // Don't allow exit on idle
  statement_timeout: 30000, // 30 second query timeout
  query_timeout: 30000, // 30 second query timeout
  application_name: 'niddik-app'
});

// Better error handling
pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
  // Don't exit the process, just log the error
});

pool.on('connect', () => {
  console.log('Database connection established');
});

// Reduce logging frequency for acquire/release
let logCount = 0;
pool.on('acquire', () => {
  if (logCount % 100 === 0) { // Log every 100th acquire instead of every 10th
    console.log(`Connection pool stats - Acquired: ${logCount + 1} connections`);
  }
  logCount++;
});

pool.on('release', () => {
  // Silent release to reduce noise
});

// Database health check function
export async function checkDatabaseHealth() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down database pool...');
  await pool.end();
  process.exit(0);
});

export const db = drizzle(pool, { schema });
export { pool };

