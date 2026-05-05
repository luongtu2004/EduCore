import { FastifyInstance } from 'fastify';
import { MongoClient, ObjectId } from 'mongodb';

export class AppointmentsService {
  private mongoClient: MongoClient;

  constructor(private server: FastifyInstance) {
    this.mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  }

  async list(filters: any = {}) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const query: any = {};
    if (filters.status) query.status = filters.status;
    
    const appointments = await db.collection('crm_appointments').find(query).sort({ startTime: 1 }).toArray();
    return appointments.map(a => ({ ...a, id: a._id.toString() }));
  }

  async create(data: any) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const appointment = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('crm_appointments').insertOne(appointment);
    return { ...appointment, id: result.insertedId.toString() };
  }

  async update(id: string, data: any) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const updateData = { ...data, updatedAt: new Date() };
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);

    await db.collection('crm_appointments').updateOne(
      { _id: new ObjectId(id) as any },
      { $set: updateData }
    );
    return { id, ...updateData };
  }

  async delete(id: string) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    await db.collection('crm_appointments').deleteOne({ _id: new ObjectId(id) as any });
    return true;
  }

  async getById(id: string) {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const app = await db.collection('crm_appointments').findOne({ _id: new ObjectId(id) as any });
    if (!app) return null;
    return { ...app, id: app._id.toString() };
  }
}
