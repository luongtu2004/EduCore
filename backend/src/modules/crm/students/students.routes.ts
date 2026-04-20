import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { convertLeadToStudentSchema } from './students.schema';

export const studentRoutes: FastifyPluginAsyncZod = async (server) => {
  const studentsService = new StudentsService(server as any);
  const studentsController = new StudentsController(studentsService);

  server.get('/', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    handler: studentsController.list.bind(studentsController),
  });

  server.post('/convert', {
    preHandler: async (req, res) => {
      await server.authenticate(req, res);
    },
    schema: { body: convertLeadToStudentSchema },
    handler: studentsController.convert.bind(studentsController),
  });
};
