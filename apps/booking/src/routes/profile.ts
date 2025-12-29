import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { DrizzleDb } from "../plugins/drizzle";
import { ProfileService } from "../services/profile";

export const profileRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const db = fastify.getDecorator<DrizzleDb>("drizzle");
  const profileService = new ProfileService(db);

  // GET /profile/:userId - Get user's profile by ID
  fastify.get(
    "/:userId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.String(),
              firstName: Type.Union([Type.String(), Type.Null()]),
              lastName: Type.Union([Type.String(), Type.Null()]),
              avatarUrl: Type.Union([Type.String(), Type.Null()]),
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
      const { userId } = request.params;

      try {
        const profile = await profileService.getUserProfile(userId);

        if (!profile) {
          return reply.status(404).send({
            error: "User profile not found",
          });
        }

        reply.send({ data: profile });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to get profile",
        });
      }
    }
  );

  // PUT /profile/:userId - Update user's profile
  fastify.put(
    "/:userId",
    {
      schema: {
        params: Type.Object({
          userId: Type.String(),
        }),
        body: Type.Object({
          firstName: Type.Optional(Type.String()),
          lastName: Type.Optional(Type.String()),
          avatarUrl: Type.Optional(Type.String()),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.String(),
              firstName: Type.Union([Type.String(), Type.Null()]),
              lastName: Type.Union([Type.String(), Type.Null()]),
              avatarUrl: Type.Union([Type.String(), Type.Null()]),
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
      const { userId } = request.params;
      const { firstName, lastName, avatarUrl } = request.body;

      try {
        const profile = await profileService.updateUserProfile(userId, {
          firstName,
          lastName,
          avatarUrl,
        });

        if (!profile) {
          return reply.status(404).send({
            error: "User profile not found",
          });
        }

        reply.send({ data: profile });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to update profile",
        });
      }
    }
  );
};
