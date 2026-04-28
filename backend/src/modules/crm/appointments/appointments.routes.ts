import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { createAppointmentSchema, updateAppointmentSchema } from './appointments.schema';

export const appointmentRoutes: FastifyPluginAsyncZod = async (server) => {
  const service = new AppointmentsService(server as any);
  const controller = new AppointmentsController(service);

  server.get('/', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: controller.list.bind(controller),
  });

  server.post('/', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: createAppointmentSchema },
    handler: controller.create.bind(controller),
  });

  server.get('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: controller.getById.bind(controller),
  });

  server.patch('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: updateAppointmentSchema },
    handler: controller.update.bind(controller),
  });

  server.delete('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: controller.delete.bind(controller),
  });
};
