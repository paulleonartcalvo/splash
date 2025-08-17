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

      const userLocations = await locationService.getLocations(
        user.id,
        organization_id
      );

      reply.send({
        data: userLocations,
      });
    }
  );

  // GET /locations/:id - Get location by ID
  fastify.get(
    "/:id",
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.Number(),
              name: Type.String(),
              slug: Type.String(),
              address: Type.String(),
              timezone: Type.String(),
              organizationId: Type.String(),
              createdAt: Type.String(),
              updatedAt: Type.String(),
            }),
          }),
          "404": Type.Object({
            error: Type.String(),
          }),
          default: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const user = request.getDecorator<User>("user");
      const { id } = request.params;

      try {
        const location = await locationService.getLocationById(user.id, id);

        if (!location) {
          return reply.status(404).send({
            error: "Location not found or you don't have access to it",
          });
        }

        reply.send({
          data: location,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to get location",
        });
      }
    }
  );

  // POST /locations - Create a new location
  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          slug: Type.String(),
          address: Type.String(),
          timezone: Type.String(),
          organizationId: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.Number(),
              name: Type.String(),
              slug: Type.String(),
              address: Type.String(),
              timezone: Type.String(),
              organizationId: Type.String(),
              createdAt: Type.String(),
              updatedAt: Type.String(),
            }),
          }),
          default: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const user = request.getDecorator<User>("user");
      const { name, slug, address, timezone, organizationId } = request.body;

      try {
        const location = await locationService.createLocation({
          name,
          slug,
          address,
          timezone,
          organizationId,
          createdBy: user.id,
        });

        reply.send({
          data: location,
        });
      } catch (error) {
        reply.status(400).send({
          error: error instanceof Error ? error.message : "Failed to create location",
        });
      }
    }
  );
};