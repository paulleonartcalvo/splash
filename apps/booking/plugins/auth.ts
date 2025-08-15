import { createClient } from "@supabase/supabase-js";
import type { FastifyPluginCallback } from "fastify";

export const authPlugin: FastifyPluginCallback = async (
  fastify,
  opts,
  done
) => {
  const url = Bun.env.SUPABASE_URL;
  const key = Bun.env.SUPABASE_KEY;

  if (!url || !key) {
    fastify.log.fatal("Supabase url or key are not defined");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.getUser("test");
  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  fastify.decorate("supabase", supabase);

  fastify.decorate("verifyToken", async (token: string) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);
      if (error) throw error;
      return user;
    } catch (error) {
      fastify.log.error("Token verification failed:");
      throw new Error("Invalid token");
    }
  });

  fastify.log.info("✅ Supabase auth plugin registered");
  done();
};
