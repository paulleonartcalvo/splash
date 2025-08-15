import { createClient, type User } from "@supabase/supabase-js";
import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";


export type VerifyTokenDecorator = (token: string) => Promise<User>
 

const authPluginFn: FastifyPluginCallback = async (fastify) => {
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

  // Test connection
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key },
    });
    if (!response.ok) {
      throw new Error(`Supabase connection failed: ${response.status}`);
    }

    fastify.log.info("✅ Supabase connection succeeded");
  } catch (error) {
    throw new Error(`Supabase connection failed: ${error}`);
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
};

export const authPlugin = fp(authPluginFn);
