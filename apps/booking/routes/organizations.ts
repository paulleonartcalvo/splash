import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { User } from "@supabase/supabase-js";
import type { DrizzleDb } from "../plugins/drizzle";
import { OrganizationService } from "../services/organization";

export const organizationRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const db = fastify.getDecorator<DrizzleDb>("drizzle");
  const organizationService = new OrganizationService(db);

  // GET /organizations - Get user's organizations
  fastify.get(
    "/",
    {
      schema: {
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.String(),
                name: Type.String(),
                slug: Type.String(),
                role: Type.String(),
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

      const userOrgs = await organizationService.getUserOrganizations(user.id);

      reply.send({
        data: userOrgs,
      });
    }
  );
};