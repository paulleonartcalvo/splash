import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { type FastifyBaseLogger, type FastifyInstance, type RawReplyDefaultExpression, type RawRequestDefaultExpression, type RawServerDefault } from 'fastify';
import { authPlugin } from './plugins/auth';
import { authRoutes } from './routes/auth';



export type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;


const fastify = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()


fastify.register(authPlugin)

fastify.register(authRoutes)