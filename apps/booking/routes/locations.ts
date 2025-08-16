import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { User } from "@supabase/supabase-js";
import type { DrizzleDb } from "../plugins/drizzle";
import { LocationService } from "../services/location";

export const locationRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const db = fastify.getDecorator<DrizzleDb>("drizzle");
  const locationService = new LocationService(db);

  // GET /locations - Get user's locations with optional organization filter
  fastify.get(
    "/",
    {
      schema: {
        querystring: Type.Object({
          organization_id: Type.Optional(Type.String()),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.Number(),
                name: Type.String(),
                slug: Type.String(),
                address: Type.String(),
                timezone: Type.String(),
                organizationId: Type.String(),
                createdAt: Type.String(),
                updatedAt: Type.String(),
              })
            ),
          }),
          default: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const user = request.getDecorator<User>("user");
      const { organization_id } = request.query;

      const userLocations = await locationService.getUserLocations(
        user.id,
        organization_id
      );

      reply.send({
        data: userLocations,
      });
    }
  );
};