import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
// 👉 Tumhare DB tables (users, posts, etc.)
// 👉 Drizzle ko batata hai structure kya hai

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  max: 10,
  // 👉 Ek time par max 10 connections open ho sakte hain
  // 👉 performance control karta hai
});

export const db = drizzle(pool, { schema });

// 👉 Ek helper function bana rahe ho
// 👉 jab manual control chahiye ho
export async function getClient() {
  const client = await pool.connect();
  return client;
}
