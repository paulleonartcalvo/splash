import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { DrizzleDb } from "../plugins/drizzle";
import { RoleService } from "../services/role";

export const roleRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const db = fastify.getDecorator<DrizzleDb>("drizzle");
  const roleService = new RoleService(db);

  // GET /roles - Get all available roles
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
                description: Type.Optional(Type.String()),
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
      try {
        const roles = await roleService.getRoles();

        reply.send({
          data: roles,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to fetch roles",
        });
      }
    }
  );

  // GET /roles/:id - Get a specific role by ID
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
              description: Type.Optional(Type.String()),
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
      try {
        const { id } = request.params;
        const role = await roleService.getRoleById(id);

        if (!role) {
          return reply.status(404).send({
            error: "Role not found",
          });
        }

        reply.send({
          data: role,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to fetch role",
        });
      }
    }
  );
};