import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, {
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from "fastify";

import cors from "@fastify/cors";
import { authPlugin } from "./plugins/auth";
import { fastifyDrizzle } from "./plugins/drizzle";
import { errorHandlerPlugin } from "./plugins/errorHandler";
import { authRoutes } from "./routes/auth";
import { inviteRoutes } from "./routes/invites";
import { locationRoutes } from "./routes/locations";
import { organizationRoutes } from "./routes/organizations";

export type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(cors);

fastify.register(errorHandlerPlugin);

fastify.register(fastifyDrizzle);

await fastify.register(authPlugin);

await fastify.register(authRoutes, { prefix: "/auth" });
await fastify.register(inviteRoutes, { prefix: "/invites" });
await fastify.register(organizationRoutes, { prefix: "/organizations" });
await fastify.register(locationRoutes, { prefix: "/locations" });

fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
