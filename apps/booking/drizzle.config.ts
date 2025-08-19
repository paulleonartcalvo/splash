import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  schemaFilter: ['public'],
  dbCredentials: {
    ssl: {
      rejectUnauthorized: false,
    },
    password: process.env["SUPABASE_PG_PASSWORD"]!,
    user: process.env["SUPABASE_PG_USER"]!,
    host: process.env["SUPABASE_PG_HOST"]!,
    port: Number(process.env["SUPABASE_PG_PORT"]!),
    database: process.env["SUPABASE_PG_DB"]!,
  },
});
