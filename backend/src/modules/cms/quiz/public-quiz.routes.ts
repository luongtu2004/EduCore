import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function publicQuizRoutes(app: FastifyInstance) {
  // Get all active questions for the test
  app.get('/questions', async (request, reply) => {
    const questions = await app.prisma.quizQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: questions };
  });

  // Submit test and create lead
  app.post('/submit', async (request, reply) => {
    const schema = z.object({
      fullName: z.string().min(1),
      phone: z.string().min(10),
      email: z.string().email().optional().or(z.literal('')),
      answers: z.array(z.number()), // Array of weight indices or scores
    });

    const body = schema.parse(request.body);
    
    // BACKEND LOGIC: Calculate Grade
    const totalScore = body.answers.reduce((a, b) => a + b, 0);
    
    let level = "Pre-IELTS (0 - 3.5)";
    let course = "IELTS Foundation";
    
    if (totalScore >= 22) {
      level = "Advanced (7.5+)";
      course = "IELTS Elite 8.0+";
    } else if (totalScore >= 15) {
      level = "Upper-Intermediate (6.0 - 7.0)";
      course = "IELTS Master 7.0";
    } else if (totalScore >= 8) {
      level = "Intermediate (4.0 - 5.5)";
      course = "IELTS Intensive 5.5";
    }

    // CRM: Create Lead
    const lead = await app.prisma.lead.create({
      data: {
        fullName: body.fullName,
        phone: body.phone,
        email: body.email || null,
        source: 'AI_TEST',
        status: 'NEW',
        note: `Kết quả Test AI (Hệ thống): ${level} - Điểm: ${totalScore}`,
      }
    });

    // CRM: Save Quiz Result
    await app.prisma.quizResult.create({
      data: {
        leadId: lead.id,
        score: totalScore,
        level: level,
        answers: body.answers as any
      }
    });

    return { 
      success: true, 
      data: { 
        level, 
        course, 
        score: totalScore,
        leadId: lead.id 
      } 
    };
  });
}
