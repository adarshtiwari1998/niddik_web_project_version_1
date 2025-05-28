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

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
   max: 10, // Reduced max connections for Render
    min: 2, // Minimum connections
    idleTimeoutMillis: 60000, // 1 minute
    connectionTimeoutMillis: 5000, // 5 seconds
    acquireTimeoutMillis: 5000, // 5 seconds
    createTimeoutMillis: 5000, // 5 seconds
    destroyTimeoutMillis: 5000, // 5 seconds
    reapIntervalMillis: 1000, // 1 second
    createRetryIntervalMillis: 200, // 200ms
    keepAlive: true,
    keepAliveInitialDelayMillis: 0
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
export { pool };

