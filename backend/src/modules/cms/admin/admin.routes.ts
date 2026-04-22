import { FastifyInstance } from 'fastify';
import { MongoClient } from 'mongodb';

export async function adminStatsRoutes(app: FastifyInstance) {
  const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

  // GET /api/v1/admin/stats — Dashboard overview
  app.get('/stats', async (request, reply) => {
    try {
      await mongoClient.connect();
      const db = mongoClient.db();

      const [
        totalPosts,
        totalCourses,
        totalUsers,
        newLeads,
        activeBanners,
      ] = await Promise.all([
        db.collection('cms_posts').countDocuments(),
        db.collection('courses').countDocuments(),
        db.collection('users').countDocuments(),
        db.collection('leads').countDocuments(),
        db.collection('cms_banners').countDocuments({ isActive: true }),
      ]);

      // Category distribution: count bài viết trong mỗi category
      const categoriesWithCount = await db.collection('cms_categories').aggregate([
        {
          $lookup: {
            from: 'cms_posts',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'posts'
          }
        },
        {
          $project: {
            name: 1,
            postCount: { $size: '$posts' }
          }
        },
        { $sort: { postCount: -1 } },
        { $limit: 7 }
      ]).toArray();

      // Recent posts (last 5) với category name
      const recentPosts = await db.collection('cms_posts').aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'cms_categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            title: 1,
            slug: 1,
            createdAt: 1,
            updatedAt: 1,
            categoryName: '$category.name'
          }
        }
      ]).toArray();

      return reply.send({
        success: true,
        data: {
          stats: {
            totalPosts,
            totalCourses,
            totalUsers,
            newLeads,
            activeBanners,
          },
          recentPosts: recentPosts.map((p: any) => ({
            id: p._id.toString(),
            title: p.title,
            slug: p.slug,
            categoryName: p.categoryName || 'Chưa phân loại',
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          })),
          categoryDistribution: categoriesWithCount.map((c: any) => ({
            name: c.name,
            count: c.postCount,
          })),
        }
      });
    } catch (error: any) {
      console.error('Admin stats error:', error);
      return reply.status(500).send({ success: false, message: error.message });
    }
  });
}
