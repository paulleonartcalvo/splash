import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { SupabaseClient } from "@supabase/supabase-js";

export const authRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const supabase = fastify.getDecorator<SupabaseClient>("supabase");

  fastify.post(
    "/login",
    {
      schema: {
        body: Type.Object({
          email: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            success: Type.Literal(true),
            message: Type.String(),
            data: Type.Object({
              email: Type.String(),
            }),
          }),
          default: {
            success: Type.Literal(false),
            error: Type.String(),
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body;

        // Send magic link via Supabase
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${process.env.FRONTEND_URL}`,
            data: {
              // Custom user metadata
              app_source: "splash",
            },
          },
        });

        if (error) {
          return reply.code(400).send({
            success: false,
            error: error.message,
          });
        }

        reply.send({
          success: true,
          message: "Magic link sent to your email",
          data: {
            email,
            // Don't send sensitive data
          },
        });
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({
          success: false,
          error: "Failed to send magic link",
        });
      }
    }
  );
};
