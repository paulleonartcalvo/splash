import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fp from "fastify-plugin";

const errorHandlerPluginFn: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);
    
    // Handle specific error types
    if (error.statusCode) {
      return reply.code(error.statusCode).send({
        success: false,
        error: error.message,
      });
    }

    // Default to 500 for unhandled errors
    return reply.code(500).send({
      success: false,
      error: "Internal server error",
    });
  });

  fastify.log.info("✅ Error handler plugin registered");
};

export const errorHandlerPlugin = fp(errorHandlerPluginFn);