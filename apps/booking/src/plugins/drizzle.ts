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
      prepare: false,
      host: Bun.env.POSTGRES_HOST,
      port: Bun.env.POSTGRES_PORT ? parseInt(Bun.env.POSTGRES_PORT) : undefined,
      database: Bun.env.POSTGRES_DB,
      user: Bun.env.POSTGRES_USER,
      password: Bun.env.POSTGRES_PASSWORD,
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
