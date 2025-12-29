import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { createClient, type User } from "@supabase/supabase-js";
import fp from "fastify-plugin";

export type VerifyTokenFn = (token: string) => Promise<User>;




const authPluginFn: FastifyPluginAsyncTypebox = async (fastify) => {
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

  // Decorate request with user property
  fastify.decorateRequest('user', null);

  // Global auth hook - skip for login route
  fastify.addHook('preHandler', async (request, reply) => {
    // Skip auth for login route and documentation routes
    if (request.url === '/auth/login' || request.url.startsWith('/documentation')) {
      return;
    }

    const authHeader = request.headers.authorization;
    console.log(authHeader)
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing authorization token' });
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      fastify.log.info(`Attempting to verify token: ${token}...`);
      const user = await fastify.getDecorator<VerifyTokenFn>('verifyToken')(token);
      fastify.log.info(`Token verified for user: ${user.id}`);
      request.setDecorator('user', user)
    } catch (error) {
      fastify.log.error(`Token verification failed: ${error}`);
      return reply.code(401).send({ error: 'Invalid authorization token' });
    }
  });

  fastify.log.info("✅ Supabase auth plugin registered");
};

// const requireAuthPluginFn:FastifyPluginAsyncTypebox = async (fastify) => {
//   fastify.decorate('requireAuth', async (request: FastifyRequest, reply: FastifyReply) => {
//     const authHeader = request.headers.authorization;
//     if (!authHeader?.startsWith('Bearer ')) {
//       return reply.code(401).send({ error: 'Missing authorization token' });
//     }
  
//     const token = authHeader.substring(7);
//     const user = await fastify.getDecorator<VerifyTokenFn>('verifyToken')(token)
//     request.user = user;
//   })
// }

export const authPlugin = fp(authPluginFn);
