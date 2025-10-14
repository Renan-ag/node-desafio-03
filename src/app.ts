import fastify from 'fastify';
import { treeifyError, ZodError } from 'zod';

export const app = fastify();

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: treeifyError(error),
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // Fornecer um log do erro para uma ferramenta externa
  }

  return reply.status(500).send({
    message: 'Internal server error.'
  });
});