
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:VHFu3oeP5Qnh@ep-little-cherry-a5wbkqbh.us-east-2.aws.neon.tech/neondb?sslmode=require";

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function createPasswordResetTable() {
  try {
    console.log('Creating password_reset_tokens table...');
    
    await client`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    
    console.log('Password reset tokens table created successfully!');
    
    // Create index for better performance
    await client`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
    `;
    
    console.log('Indexes created successfully!');
    
  } catch (error) {
    console.error('Error creating password reset tokens table:', error);
  } finally {
    await client.end();
  }
}

createPasswordResetTable();
