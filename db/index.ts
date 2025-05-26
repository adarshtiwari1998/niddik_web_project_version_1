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
import { integer, sqliteTable, sql, text } from "drizzle-orm/sqlite-core";

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 300000, // 5 minutes
  connectionTimeoutMillis: 10000, // 10 seconds
  query_timeout: 10000, // 10 seconds
  statement_timeout: 10000, // 10 seconds
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });
export { pool };

export const jobListings = sqliteTable("job_listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(),
  experienceLevel: text("experience_level").notNull(),
  salary: text("salary").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  benefits: text("benefits"),
  applicationUrl: text("application_url"),
  contactEmail: text("contact_email"),
  status: text("status").notNull().default("active"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  urgent: integer("urgent", { mode: "boolean" }).default(false),
  priority: integer("priority", { mode: "boolean" }).default(false),
  isOpen: integer("is_open", { mode: "boolean" }).default(false),
  postedDate: integer("posted_date", { mode: "timestamp" }).default(sql`(unixepoch())`),
  expiryDate: integer("expiry_date", { mode: "timestamp" }),
  category: text("category").notNull(),
  skills: text("skills").notNull(),
});