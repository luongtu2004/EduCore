import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';

interface ExtendedApp extends FastifyInstance {
  prisma: PrismaClient;
}

export async function publicQuizRoutes(app: ExtendedApp) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

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
      phone: z.string().min(1),
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

    try {
      await mongoClient.connect();
      const db = mongoClient.db();
      
      // CRM: Create Lead with embedded quiz result (Native)
      const leadResult = await db.collection('crm_leads').insertOne({
        fullName: body.fullName,
        phone: body.phone,
        email: body.email || null,
        source: 'AI_TEST',
        status: 'NEW',
        courseName: course,
        quizResult: {
          score: totalScore,
          level: level,
        },
        note: `Kết quả Test AI: ${level} - Điểm: ${totalScore}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const leadId = leadResult.insertedId;

      // CRM: Save Quiz Result (Native)
      await db.collection('crm_quiz_results').insertOne({
        leadId: leadId,
        score: totalScore,
        level: level,
        answers: body.answers,
        createdAt: new Date()
      });

      // Activity Log (Native)
      await db.collection('ActivityLog').insertOne({
        leadId: leadId,
        type: 'CREATED',
        content: `Lead mới đăng ký từ AI_TEST`,
        createdAt: new Date()
      });

      return { 
        success: true, 
        data: { 
          level, 
          course, 
          score: totalScore,
          leadId: leadId.toString()
        } 
      };
    } finally {}
  });
}
