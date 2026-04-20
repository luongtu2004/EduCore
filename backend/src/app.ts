import fastify from 'fastify';
import cors from '@fastify/cors';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import prismaPlugin from './plugins/prisma';
import authPlugin from './plugins/auth';
import fastifySocketIO from 'fastify-socket.io';
import { AppError } from './common/errors/AppError';

import { authRoutes } from './modules/auth/auth.routes';
import { leadRoutes } from './modules/crm/leads/leads.routes';
import { postRoutes } from './modules/cms/posts/posts.routes';
import { studentRoutes } from './modules/crm/students/students.routes';
import { mediaRoutes } from './modules/cms/media/media.routes';
import { learningPathRoutes } from './modules/learning-path/learning-path.routes';
import { courseRoutes } from './modules/crm/courses/courses.routes';
import { publicQuizRoutes } from './modules/cms/quiz/public-quiz.routes';
import { quizManagementRoutes } from './modules/cms/quiz/quiz-management.routes';
import { courseManagementRoutes } from './modules/cms/courses/courses.routes';
import { categoriesRoutes } from './modules/cms/categories/categories.routes';
import { faqRoutes } from './modules/cms/faqs/faqs.routes';
import { bannerRoutes } from './modules/cms/banners/banners.routes';
import { testimonialRoutes } from './modules/cms/testimonials/testimonials.routes';

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Register Plugins
app.register(cors, { origin: '*' });
app.register(prismaPlugin);
app.register(authPlugin);
app.register(fastifySocketIO, {
  cors: {
    origin: '*',
  },
});

// Serve static files - Sử dụng path.resolve để đảm bảo đường dẫn tuyệt đối chính xác
const publicUploadsDir = path.resolve(__dirname, '../../public/uploads');
app.register(fastifyStatic, {
  root: publicUploadsDir,
  prefix: '/uploads/',
});

// Register Routes
app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(leadRoutes, { prefix: '/api/v1/crm/leads' });
app.register(studentRoutes, { prefix: '/api/v1/crm/students' });
app.register(postRoutes, { prefix: '/api/v1/cms/posts' });
app.register(mediaRoutes, { prefix: '/api/v1/media' });
app.register(learningPathRoutes, { prefix: '/api/v1/learning-paths' });
app.register(courseRoutes, { prefix: '/api/v1/crm/courses' });
app.register(publicQuizRoutes, { prefix: '/api/v1/public/quiz' });
app.register(quizManagementRoutes, { prefix: '/api/v1/cms/quiz' });
app.register(courseManagementRoutes, { prefix: '/api/v1/cms/courses' });
app.register(categoriesRoutes, { prefix: '/api/v1/cms/categories' });
app.register(faqRoutes, { prefix: '/api/v1/cms/faqs' });
app.register(bannerRoutes, { prefix: '/api/v1/cms/banners' });
app.register(testimonialRoutes, { prefix: '/api/v1/cms/testimonials' });

app.get('/health', async () => ({ status: 'ok', service: 'EduCore' }));

// Sửa lỗi typing triệt để cho Error Handler bằng cách dùng any cho đối tượng error
app.setErrorHandler((error: any, request, reply) => {
  request.log.error(error);

  // Xử lý lỗi validate từ Zod
  if (error.validation) {
    return reply.status(400).send({ 
      success: false, 
      message: 'Dữ liệu không hợp lệ',
      errors: error.validation 
    });
  }

  // Xử lý lỗi nghiệp vụ AppError
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ 
      success: false, 
      message: error.message 
    });
  }

  // Lỗi hệ thống mặc định
  reply.status(500).send({ 
    success: false, 
    message: error.message || 'Lỗi hệ thống nội bộ' 
  });
});

export default app;
