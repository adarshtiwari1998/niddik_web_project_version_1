import pg from 'pg';
const { Pool } = pg;

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log("Creating demo_requests table if it doesn't exist...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "demo_requests" (
        "id" SERIAL PRIMARY KEY,
        "work_email" TEXT NOT NULL UNIQUE,
        "phone_number" TEXT NOT NULL,
        "message" TEXT,
        "company_name" TEXT,
        "full_name" TEXT,
        "job_title" TEXT,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "accepted_terms" BOOLEAN NOT NULL DEFAULT FALSE,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "scheduled_date" TIMESTAMP,
        "admin_notes" TEXT
      );
    `);
    console.log("Table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await pool.end();
  }
}

main();
