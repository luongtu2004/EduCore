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
    return leads.map(l => ({ ...l, id: l._id.toString() }));
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
      note: input.note,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('crm_leads').insertOne(lead);
    
    // Activity log
    await db.collection('crm_activity_logs').insertOne({
      leadId: result.insertedId.toString(),
      type: 'CREATED',
      content: `Lead mới đăng ký từ ${lead.source}`,
      createdAt: new Date()
    });

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
}
