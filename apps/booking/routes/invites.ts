import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { User } from "@supabase/supabase-js";
import type { DrizzleDb } from "../plugins/drizzle";
import { InviteService } from "../services/invite";

export const inviteRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const db = fastify.getDecorator<DrizzleDb>("drizzle");
  const inviteService = new InviteService(db);

  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          email: Type.String(),
          organizationId: Type.String(),
          locationId: Type.Number(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              inviteId: Type.Number(),
            }),
          }),
          default: {
            error: Type.String(),
          },
        },
      },
    },
    async (request, reply) => {
      const { email, organizationId, locationId } = request.body;
      const user = request.getDecorator<User>("user");

      const result = await inviteService.generateInvite({
        invitedUserEmail: email,
        organizationId,
        locationId,
        createdBy: user.id,
      });

      reply.send({
        data: {
          inviteId: result.id,
        },
      });
    }
  );

  // GET /invites - Get current user's invites
  fastify.get(
    "/",
    {
      schema: {
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.Number(),
                createdAt: Type.String(),
                invitedUserEmail: Type.String(),
                organizationId: Type.String(),
                organizationName: Type.String(),
                organizationSlug: Type.String(),
                locationId: Type.Number(),
                locationName: Type.String(),
                locationSlug: Type.String(),
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
      const userEmail = user.email;

      if (!userEmail) {
        return reply.code(401).send({
          error: "User email not found",
        });
      }

      const invites = await inviteService.getUserInvites(userEmail);

      reply.send({
        data: invites,
      });
    }
  );
};
