import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import * as multipart from '@fastify/multipart';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

export const mediaRoutes: FastifyPluginAsyncZod = async (server) => {
  // Đăng ký plugin multipart
  await server.register(multipart as any);

  server.post('/upload', {
    preHandler: async (request, reply) => {
      await server.authenticate(request, reply);
    },
    handler: async (request, reply) => {
      // Ép kiểu request để nhận diện hàm file()
      const data = await (request as any).file();
      
      if (!data) {
        return reply.status(400).send({ success: false, message: 'Không có file nào được upload' });
      }

      const fileName = `${Date.now()}-${data.filename}`;
      const uploadPath = path.join(__dirname, '../../../../public/uploads', fileName);

      const dir = path.dirname(uploadPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await pump(data.file, fs.createWriteStream(uploadPath));

      return reply.send({
        success: true,
        message: 'Upload thành công',
        data: {
          url: `/uploads/${fileName}`,
          fileName,
        },
      });
    },
  });
};
