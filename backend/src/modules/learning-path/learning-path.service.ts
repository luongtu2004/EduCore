import { FastifyInstance } from 'fastify';
import { MongoClient, ObjectId } from 'mongodb';

export class LearningPathService {
  private mongoClient: MongoClient;

  constructor(private server: FastifyInstance) {
    this.mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  }

  private async getDb() {
    await this.mongoClient.connect();
    return this.mongoClient.db();
  }

  private mapPath(doc: any) {
    if (!doc) return null;
    return {
      ...doc,
      id: doc._id.toString(),
      _id: undefined,
      steps: (doc.steps || []).map((s: any) => ({
        ...s,
        id: s._id?.toString() || s.id,
        _id: undefined,
      })),
    };
  }

  // ─── LIST ─────────────────────────────────────────────────────────────────
  async list(admin: boolean = false) {
    const db = await this.getDb();
    const filter = admin ? {} : { isActive: true };

    const paths = await db.collection('learning_paths')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const results = await Promise.all(
      paths.map(async (p) => {
        const steps = await db.collection('learning_path_steps')
          .find({ learningPathId: p._id.toString() })
          .sort({ order: 1 })
          .toArray();
        return this.mapPath({ ...p, steps });
      })
    );

    return results;
  }

  // ─── GET BY SLUG ───────────────────────────────────────────────────────────
  async getBySlug(slug: string) {
    const db = await this.getDb();
    const path = await db.collection('learning_paths').findOne({ slug });
    if (!path) return null;

    const steps = await db.collection('learning_path_steps')
      .find({ learningPathId: path._id.toString() })
      .sort({ order: 1 })
      .toArray();

    return this.mapPath({ ...path, steps });
  }

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(data: any) {
    const db = await this.getDb();

    // Check duplicate slug
    const existing = await db.collection('learning_paths').findOne({ slug: data.slug });
    if (existing) {
      throw new Error(`Slug "${data.slug}" đã tồn tại. Vui lòng đổi tên lộ trình.`);
    }

    const steps = data.steps || [];

    const result = await db.collection('learning_paths').insertOne({
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const pathId = result.insertedId.toString();

    // Insert steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await db.collection('learning_path_steps').insertOne({
        title: step.title,
        description: step.description,
        target: step.target,
        features: step.features || [],
        color: step.color || 'emerald',
        order: step.order ?? i,
        learningPathId: pathId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return await this.getById(pathId);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, data: any) {
    const db = await this.getDb();

    const updateFields: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.slug !== undefined) updateFields.slug = data.slug;
    if (data.description !== undefined) updateFields.description = data.description || null;
    if (data.isActive !== undefined) updateFields.isActive = data.isActive;

    await db.collection('learning_paths').updateOne(
      { _id: new ObjectId(id) as any },
      { $set: updateFields }
    );

    // Replace steps if provided
    if (data.steps !== undefined) {
      await db.collection('learning_path_steps').deleteMany({ learningPathId: id });

      const steps = data.steps || [];
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await db.collection('learning_path_steps').insertOne({
          title: step.title,
          description: step.description,
          target: step.target,
          features: step.features || [],
          color: step.color || 'emerald',
          order: step.order ?? i,
          learningPathId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return await this.getById(id);
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  async delete(id: string) {
    const db = await this.getDb();
    await db.collection('learning_path_steps').deleteMany({ learningPathId: id });
    await db.collection('learning_paths').deleteOne({ _id: new ObjectId(id) as any });
    return { success: true };
  }

  // ─── UPDATE STATUS ─────────────────────────────────────────────────────────
  async updateStatus(id: string, isActive: boolean) {
    const db = await this.getDb();
    await db.collection('learning_paths').updateOne(
      { _id: new ObjectId(id) as any },
      { $set: { isActive, updatedAt: new Date() } }
    );
    return { success: true };
  }

  // ─── HELPER ────────────────────────────────────────────────────────────────
  private async getById(id: string) {
    const db = await this.getDb();
    const path = await db.collection('learning_paths').findOne({ _id: new ObjectId(id) as any });
    if (!path) return null;

    const steps = await db.collection('learning_path_steps')
      .find({ learningPathId: id })
      .sort({ order: 1 })
      .toArray();

    return this.mapPath({ ...path, steps });
  }
}
