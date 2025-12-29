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
          locationId: Type.String(),
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
                locationId: Type.String(),
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

  // POST /invites/:id/accept - Accept/consume an invite
  fastify.post(
    "/:id/accept",
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              organizationId: Type.String(),
              locationId: Type.String(),
            }),
          }),
          default: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = request.getDecorator<User>("user");

      if (!user?.email) {
        return reply.code(401).send({
          error: "User email not found",
        });
      }

      const result = await inviteService.consumeInvite(
        id,
        user.id,
        user.email
      );

      reply.send({
        data: result,
      });
    }
  );

  // POST /invites/:id/reject - Reject/decline an invite
  fastify.post(
    "/:id/reject",
    {
      schema: {
        params: Type.Object({
          id: Type.Number(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              inviteId: Type.Number(),
            }),
          }),
          default: Type.Object({
            error: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = request.getDecorator<User>("user");

      if (!user?.email) {
        return reply.code(401).send({
          error: "User email not found",
        });
      }

      const result = await inviteService.rejectInvite(id, user.email);

      reply.send({
        data: result,
      });
    }
  );
};
