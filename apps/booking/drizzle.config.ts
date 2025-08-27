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
    password: Bun.env["SUPABASE_PG_PASSWORD"]!,
    user: Bun.env["SUPABASE_PG_USER"]!,
    host: Bun.env["SUPABASE_PG_HOST"]!,
    port: Number(Bun.env["SUPABASE_PG_PORT"]!),
    database: Bun.env["SUPABASE_PG_DB"]!,
  },
});
