import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import fp from "fastify-plugin";
import type postgres from "postgres";

export type DrizzleDb = PostgresJsDatabase<Record<string, never>> & {
  $client: postgres.Sql<{}>;
};

const fastifyDrizzleFn: FastifyPluginAsyncTypebox = async (fastify) => {
  const connection = drizzle({
    connection: {
      password: Bun.env["SUPABASE_PG_PASSWORD"]!,
      user: Bun.env["SUPABASE_PG_USER"]!,
      host: Bun.env["SUPABASE_PG_HOST"]!,
      port: Number(Bun.env["SUPABASE_PG_PORT"]!),
      database: Bun.env["SUPABASE_PG_DB"]!,
    },
  });

  if (!fastify.hasDecorator("drizzle")) {
    fastify.decorate("drizzle", connection);
  }

  fastify.addHook("onClose", () => {
    connection.$client.end();
  });
};

export const fastifyDrizzle = fp(fastifyDrizzleFn);
