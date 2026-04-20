import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import * as multipart from '@fastify/multipart';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';

const pump = promisify(pipeline);

export const mediaRoutes: FastifyPluginAsyncZod = async (server) => {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  
  // Đăng ký plugin multipart
  await server.register(multipart as any);

  server.post('/upload', {
    preHandler: async (request, reply) => {
      await server.authenticate(request, reply);
    },
    handler: async (request, reply) => {
      const data = await (request as any).file();
      
      if (!data) {
        return reply.status(400).send({ success: false, message: 'Không có file nào được upload' });
      }

      const fileName = `${Date.now()}-${data.filename}`;
      const uploadDir = path.join(__dirname, '../../../../public/uploads');
      const uploadPath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
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

  // New route to list all uploaded files + database assets
  server.get('/', {
    preHandler: async (request, reply) => {
      await server.authenticate(request, reply);
    },
    handler: async (request, reply) => {
      const uploadDir = path.join(__dirname, '../../../../public/uploads');
      const filesystemMedia: any[] = [];
      
      // 1. Scan filesystem
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
          const stats = fs.statSync(path.join(uploadDir, file));
          filesystemMedia.push({
            fileName: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime,
          });
        });
      }

      // 2. Fetch from MongoDB
      let dbMedia: any[] = [];
      try {
        await mongoClient.connect();
        const db = mongoClient.db();
        dbMedia = await db.collection('media').find({}).toArray();
      } catch (error) {
        console.error('Error fetching media from DB:', error);
      }
      
      // 3. Combine and remove duplicates by URL
      const combined = [...filesystemMedia];
      const urls = new Set(combined.map(m => m.url));

      dbMedia.forEach((m: any) => {
        if (!urls.has(m.url)) {
          combined.push({
            fileName: m.fileName || m.url.split('/').pop(),
            url: m.url,
            size: m.size || 0,
            createdAt: m.createdAt || new Date(),
          });
        }
      });

      const mediaList = combined.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      return reply.send({ success: true, data: mediaList });
    }
  });

  // New route to delete a file
  server.delete('/:fileName', {
    preHandler: async (request, reply) => {
      await server.authenticate(request, reply);
    },
    handler: async (request, reply) => {
      const { fileName } = request.params as { fileName: string };
      const filePath = path.join(__dirname, '../../../../public/uploads', fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        
        // Also remove from DB if exists
        try {
          await mongoClient.connect();
          const db = mongoClient.db();
          await db.collection('media').deleteOne({ fileName });
        } catch (error) {
          console.error('Error deleting media from DB:', error);
        }

        return reply.send({ success: true, message: 'Deleted successfully' });
      }

      return reply.status(404).send({ success: false, message: 'File not found' });
    }
  });
};
