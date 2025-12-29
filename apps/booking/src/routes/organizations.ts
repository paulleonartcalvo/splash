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
        querystring: Type.Object({
          slug: Type.Optional(Type.String()),
        }),
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
      const { slug } = request.query;

      const userOrgs = await organizationService.getUserOrganizations(user.id, slug);

      reply.send({
        data: userOrgs,
      });
    }
  );

  // GET /organizations/:id - Get organization by ID
  fastify.get(
    "/:id",
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.String(),
              name: Type.String(),
              slug: Type.String(),
              role: Type.String(),
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
        const organization = await organizationService.getOrganizationById(user.id, id);

        if (!organization) {
          return reply.status(404).send({
            error: "Organization not found or you don't have access to it",
          });
        }

        reply.send({
          data: organization,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to get organization",
        });
      }
    }
  );


  // POST /organizations - Create a new organization
  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          slug: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.String(),
              name: Type.String(),
              slug: Type.String(),
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
      const { name, slug } = request.body;


      try {
        const organization = await organizationService.createOrganization({
          name,
          slug,
          createdBy: user.id,
        });

        reply.send({
          data: organization,
        });
      } catch (error) {
        reply.status(400).send({
          error: error instanceof Error ? error.message : "Failed to create organization",
        });
      }
    }
  );
};