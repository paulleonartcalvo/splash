import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { User } from "@supabase/supabase-js";
import type { DrizzleDb } from "../plugins/drizzle";
import { SessionService } from "../services/session";

export const sessionRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const db = fastify.getDecorator<DrizzleDb>("drizzle");
  const sessionService = new SessionService(db);

  // GET /sessions - Get user's sessions with optional location filter
  fastify.get(
    "/",
    {
      schema: {
        querystring: Type.Object({
          location_id: Type.Optional(Type.String()),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.String(),
                title: Type.String(),
                description: Type.Union([Type.String(), Type.Null()]),
                startDate: Type.String(),
                startTime: Type.String(),
                endTime: Type.String(),
                locationId: Type.String(),
                rrule: Type.Union([Type.String(), Type.Null()]),
                status: Type.Union([
                  Type.Literal('draft'),
                  Type.Literal('active'),
                  Type.Literal('disabled')
                ]),
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
      const { location_id } = request.query;

      try {
        const userSessions = await sessionService.getSessions(
          user.id,
          location_id
        );

        reply.send({
          data: userSessions,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to get sessions",
        });
      }
    }
  );

  // GET /sessions/:id - Get session by ID
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
              title: Type.String(),
              description: Type.Union([Type.String(), Type.Null()]),
              startDate: Type.String(),
              startTime: Type.String(),
              endTime: Type.String(),
              locationId: Type.String(),
              rrule: Type.Union([Type.String(), Type.Null()]),
              status: Type.Union([
                Type.Literal('draft'),
                Type.Literal('active'),
                Type.Literal('disabled')
              ]),
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
        const session = await sessionService.getSessionById(user.id, id);

        if (!session) {
          return reply.status(404).send({
            error: "Session not found or you don't have access to it",
          });
        }

        reply.send({
          data: session,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to get session",
        });
      }
    }
  );

  // POST /sessions - Create a new session
  fastify.post(
    "/",
    {
      schema: {
        body: Type.Object({
          title: Type.String(),
          description: Type.Optional(Type.String()),
          startDate: Type.String(),
          startTime: Type.String(),
          endTime: Type.String(),
          locationId: Type.String(),
          rrule: Type.Optional(Type.String()),
          status: Type.Optional(Type.Union([
            Type.Literal('draft'),
            Type.Literal('active'),
            Type.Literal('disabled')
          ])),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.String(),
              title: Type.String(),
              description: Type.Union([Type.String(), Type.Null()]),
              startDate: Type.String(),
              startTime: Type.String(),
              endTime: Type.String(),
              locationId: Type.String(),
              rrule: Type.Union([Type.String(), Type.Null()]),
              status: Type.Union([
                Type.Literal('draft'),
                Type.Literal('active'),
                Type.Literal('disabled')
              ]),
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
      const { title, description, startDate, startTime, endTime, locationId, rrule, status } = request.body;

      try {
        const session = await sessionService.createSession({
          title,
          description,
          startDate,
          startTime,
          endTime,
          locationId,
          rrule,
          status,
          userId: user.id,
        });

        reply.send({
          data: session,
        });
      } catch (error) {
        reply.status(400).send({
          error: error instanceof Error ? error.message : "Failed to create session",
        });
      }
    }
  );

  // POST /sessions/:id/reservations - Create a reservation for a session
  fastify.post(
    "/:id/reservations",
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          instanceDatetime: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Object({
              id: Type.Number(),
              sessionId: Type.String(),
              userId: Type.String(),
              instanceDatetime: Type.String(),
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
      const { id: sessionId } = request.params;
      const { instanceDatetime } = request.body;

      try {
        const reservation = await sessionService.createReservation({
          sessionId,
          userId: user.id,
          instanceDatetime,
        });

        reply.send({
          data: reservation,
        });
      } catch (error) {
        reply.status(400).send({
          error: error instanceof Error ? error.message : "Failed to create reservation",
        });
      }
    }
  );

  // GET /sessions/:id/reservations - Get reservations for a session
  fastify.get(
    "/:id/reservations",
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.Number(),
                sessionId: Type.String(),
                userId: Type.String(),
                instanceDatetime: Type.String(),
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
      const { id: sessionId } = request.params;

      try {
        const reservations = await sessionService.getUserReservations(
          user.id,
          sessionId
        );

        reply.send({
          data: reservations,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to get reservations",
        });
      }
    }
  );

  // GET /sessions/find - Find sessions with filters
  fastify.get(
    "/find",
    {
      schema: {
        querystring: Type.Object({
          user_id: Type.Optional(Type.String()),
          location_id: Type.Optional(Type.String()),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.String(),
                title: Type.String(),
                description: Type.Union([Type.String(), Type.Null()]),
                startDate: Type.String(),
                startTime: Type.String(),
                endTime: Type.String(),
                locationId: Type.String(),
                rrule: Type.Union([Type.String(), Type.Null()]),
                status: Type.Union([
                  Type.Literal('draft'),
                  Type.Literal('active'),
                  Type.Literal('disabled')
                ]),
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
      const { user_id, location_id } = request.query;

      try {
        const sessions = await sessionService.findSessions({
          requestingUserId: user.id,
          filterUserId: user_id,
          locationId: location_id,
        });

        reply.send({
          data: sessions,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to find sessions",
        });
      }
    }
  );

  // GET /sessions/bookings - Find session bookings with filters
  fastify.get(
    "/bookings",
    {
      schema: {
        querystring: Type.Object({
          user_id: Type.Optional(Type.String()),
          location_id: Type.Optional(Type.String()),
          instance_date_from: Type.Optional(Type.String()),
          instance_date_to: Type.Optional(Type.String()),
        }),
        response: {
          "2xx": Type.Object({
            data: Type.Array(
              Type.Object({
                id: Type.Number(),
                sessionId: Type.String(),
                userId: Type.String(),
                instanceDatetime: Type.String(),
                createdAt: Type.String(),
                updatedAt: Type.String(),
                session: Type.Object({
                  id: Type.String(),
                  title: Type.String(),
                  description: Type.Union([Type.String(), Type.Null()]),
                  startDate: Type.String(),
                  startTime: Type.String(),
                  endTime: Type.String(),
                  locationId: Type.String(),
                  rrule: Type.Union([Type.String(), Type.Null()]),
                  status: Type.Union([
                    Type.Literal('draft'),
                    Type.Literal('active'),
                    Type.Literal('disabled')
                  ]),
                }),
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
      const { user_id, location_id, instance_date_from, instance_date_to } = request.query;

      try {
        const bookings = await sessionService.findSessionBookings({
          requestingUserId: user.id,
          filterUserId: user_id,
          locationId: location_id,
          instanceDateFrom: instance_date_from,
          instanceDateTo: instance_date_to,
        });

        reply.send({
          data: bookings,
        });
      } catch (error) {
        reply.status(500).send({
          error: error instanceof Error ? error.message : "Failed to find session bookings",
        });
      }
    }
  );
};