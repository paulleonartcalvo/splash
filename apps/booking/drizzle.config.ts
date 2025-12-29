import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  schemaFilter: ["public"],
  entities: {
    roles: {
      provider: 'supabase'
    }
  },
  dbCredentials: {
    host: process.env.DRIZZLE_POSTGRES_HOST!,
    port: parseInt(process.env.DRIZZLE_POSTGRES_PORT!),
    database: process.env.DRIZZLE_POSTGRES_DB!,
    password: process.env.DRIZZLE_POSTGRES_PASSWORD!,
    user: process.env.DRIZZLE_POSTGRES_USER!,
    ssl: { rejectUnauthorized: false },
  },
});
