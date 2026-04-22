import { FastifyInstance } from 'fastify';
import { CreateLeadInput, UpdateLeadStatusInput } from './leads.schema';
import { MongoClient, ObjectId } from 'mongodb';

export class LeadsService {
  private mongoClient: MongoClient;
  
  constructor(private server: FastifyInstance) {
    this.mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  }

  async getAllLeads() {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const leads = await db.collection('crm_leads').find({}).sort({ createdAt: -1 }).toArray();
    
    // For leads without embedded quizResult, try to join from crm_quiz_results
    const enrichedLeads = await Promise.all(leads.map(async (lead) => {
      if (!lead.quizResult && lead.source === 'AI_TEST') {
        const quizResult = await db.collection('crm_quiz_results').findOne({ 
          leadId: lead._id 
        });
        if (quizResult) {
          return { ...lead, id: lead._id.toString(), quizResult: { score: quizResult.score, level: quizResult.level } };
        }
      }
      return { ...lead, id: lead._id.toString() };
    }));

    return enrichedLeads;
  }

  async createLead(input: CreateLeadInput) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    
    const lead = {
      fullName: input.fullName,
      email: input.email || null,
      phone: input.phone,
      source: input.source || 'WEBSITE',
      status: 'NEW',
      note: input.note || null,
      // Checkout fields
      courseName: input.courseName || null,
      paymentMethod: input.paymentMethod || null,
      couponCode: input.couponCode || null,
      finalPrice: input.finalPrice ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('crm_leads').insertOne(lead);
    
    // Activity log
    await db.collection('crm_activity_logs').insertOne({
      leadId: result.insertedId.toString(),
      type: 'CREATED',
      content: `Khách hàng mới đăng ký từ ${lead.source}${lead.courseName ? ` - Khóa học: ${lead.courseName}` : ''}${lead.paymentMethod === 'TRANSFER' ? ' [ĐÃ CHUYỂN KHOẢN]' : ''}`,
      createdAt: new Date()
    });

    // If it's a course checkout, create an Order as well
    if (lead.courseName && lead.finalPrice !== null && lead.finalPrice !== undefined) {
      const orderIdStr = `ORD-${Date.now().toString().slice(-6)}`;
      await db.collection('crm_orders').insertOne({
        id: orderIdStr,
        studentName: lead.fullName,
        courseName: lead.courseName,
        amount: lead.finalPrice,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        leadId: result.insertedId.toString()
      });
    }

    // 🔔 Emit real-time notification to all admin clients
    try {
      (this.server as any).io.emit('newLead', {
        id: result.insertedId.toString(),
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        courseName: lead.courseName,
        paymentMethod: lead.paymentMethod,
        finalPrice: lead.finalPrice,
        note: lead.note,
        source: lead.source,
        createdAt: lead.createdAt,
      });
    } catch (e) {
      // Socket may not be available in test env
    }

    return { id: result.insertedId, ...lead };
  }

  async updateStatus(leadId: string, input: UpdateLeadStatusInput, consultantId: string) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    
    const oldLead = await db.collection('crm_leads').findOne({ _id: new ObjectId(leadId) as any });
    
    await db.collection('crm_leads').updateOne(
      { _id: new ObjectId(leadId) as any },
      { 
        $set: { 
          status: input.status, 
          consultantId: consultantId,
          updatedAt: new Date()
        } 
      }
    );
    
    await db.collection('crm_activity_logs').insertOne({
      leadId,
      type: 'STATUS_CHANGE',
      content: `Cập nhật trạng thái: ${oldLead?.status} -> ${input.status}. Ghi chú: ${input.note || 'Không có'}`,
      createdAt: new Date()
    });

    const updatedLead = await db.collection('crm_leads').findOne({ _id: new ObjectId(leadId) as any });
    return { ...updatedLead, id: updatedLead?._id.toString() };
  }

  async assignLead(leadId: string, input: any, adminId: string) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();

    const result = await db.collection('crm_leads').updateOne(
      { _id: new ObjectId(leadId) as any },
      { 
        $set: { 
          assignedTo: input.assignedTo,
          assignedStaffName: input.assignedStaffName,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Không tìm thấy Lead');
    }

    // Tùy chọn: Log hành động assign
    await db.collection('crm_activity_logs').insertOne({
      leadId,
      type: 'ASSIGNED',
      content: `Lead được giao cho nhân viên: ${input.assignedStaffName || input.assignedTo}`,
      createdBy: adminId,
      createdAt: new Date()
    });

    return { success: true };
  }

  async getById(id: string) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const lead = await db.collection('crm_leads').findOne({ _id: new ObjectId(id) as any });
    const activityLogs = await db.collection('crm_activity_logs').find({ leadId: id }).sort({ createdAt: -1 }).toArray();
    
    return {
      ...lead,
      id: lead?._id.toString(),
      activityLogs: activityLogs.map(l => ({ ...l, id: l._id.toString() }))
    };
  }

  async deleteLead(id: string) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    
    const result = await db.collection('crm_leads').deleteOne({ _id: new ObjectId(id) as any });
    
    if (result.deletedCount > 0) {
      await db.collection('crm_activity_logs').deleteMany({ leadId: id });
    }
    
    return result.deletedCount > 0;
  }
}
