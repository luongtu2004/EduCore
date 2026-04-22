import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { createLeadSchema, updateLeadStatusSchema, assignLeadSchema } from './leads.schema';

export const leadRoutes: FastifyPluginAsyncZod = async (server) => {
  const leadsService = new LeadsService(server as any);
  const leadsController = new LeadsController(leadsService);

  server.post('/public', {
    schema: { body: createLeadSchema },
    handler: leadsController.create.bind(leadsController),
  });

  server.get('/', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: leadsController.list.bind(leadsController),
  });

  server.patch('/:id/status', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: updateLeadStatusSchema },
    handler: leadsController.updateStatus.bind(leadsController),
  });

  server.get('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: leadsController.getById.bind(leadsController),
  });

  server.patch('/:id/assign', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: assignLeadSchema },
    handler: leadsController.assignLead.bind(leadsController),
  });

  server.delete('/:id', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: leadsController.delete.bind(leadsController),
  });
};
