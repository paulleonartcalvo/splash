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
import { authRoutes } from "./routes/auth";

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
await fastify.register(authPlugin);

fastify.register(authRoutes, { prefix: "/auth" });

fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
