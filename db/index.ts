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
  max: 5, // Further reduced for Render free tier
  min: 0, // No minimum connections to avoid idle timeouts
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 10000, // 10 seconds
  acquireTimeoutMillis: 10000, // 10 seconds
  createTimeoutMillis: 10000, // 10 seconds
  destroyTimeoutMillis: 5000, // 5 seconds
  reapIntervalMillis: 1000, // 1 second
  createRetryIntervalMillis: 500, // 500ms
  keepAlive: false, // Disable keep-alive for better timeout handling
  allowExitOnIdle: true, // Allow process to exit when no connections
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
  console.log('New database connection established');
});

pool.on('acquire', () => {
  console.log('Connection acquired from pool');
});

pool.on('release', () => {
  console.log('Connection released back to pool');
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

