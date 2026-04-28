import { FastifyInstance } from 'fastify';
import { MongoClient } from 'mongodb';

// Shared MongoDB client (basic connection pooling)
let sharedMongoClient: MongoClient | null = null;
async function getDb() {
  if (!sharedMongoClient) {
    sharedMongoClient = new MongoClient(process.env.DATABASE_URL || '');
  }
  await sharedMongoClient.connect();
  return sharedMongoClient.db();
}

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

  // GET /api/v1/admin/crm-stats — CRM Real-time Stats
  app.get('/crm-stats', async (request, reply) => {
    try {
      const db = await getDb();
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const [
        totalLeads,
        newLeadsThisMonth,
        newLeadsLastMonth,
        totalStudents,
        newStudentsThisMonth,
        wonLeads,
        paidOrders,
        totalRevenueAgg,
        revenueLastMonthAgg,
        upcomingAppointments,
      ] = await Promise.all([
        db.collection('crm_leads').countDocuments(),
        db.collection('crm_leads').countDocuments({ createdAt: { $gte: startOfMonth } }),
        db.collection('crm_leads').countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        db.collection('crm_students').countDocuments(),
        db.collection('crm_students').countDocuments({ createdAt: { $gte: startOfMonth } }),
        db.collection('crm_leads').countDocuments({ status: 'WON' }),
        db.collection('crm_orders').countDocuments({ status: 'PAID' }),
        db.collection('crm_orders').aggregate([
          { $match: { status: 'PAID' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).toArray(),
        db.collection('crm_orders').aggregate([
          { $match: { status: 'PAID', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).toArray(),
        db.collection('crm_appointments').find({ startTime: { $gte: now } }).sort({ startTime: 1 }).limit(3).toArray(),
      ]);

      const totalRevenue = totalRevenueAgg[0]?.total || 0;
      const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;

      // Revenue this month
      const revenueThisMonthAgg = await db.collection('crm_orders').aggregate([
        { $match: { status: 'PAID', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      const revenueThisMonth = revenueThisMonthAgg[0]?.total || 0;

      // Conversion rate (WON / total leads)
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

      // Monthly revenue chart - last 6 months
      const monthlyChart = [];
      for (let i = 5; i >= 0; i--) {
        const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
        const [rev, leadsCount] = await Promise.all([
          db.collection('crm_orders').aggregate([
            { $match: { status: 'PAID', createdAt: { $gte: mStart, $lte: mEnd } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]).toArray(),
          db.collection('crm_leads').countDocuments({ createdAt: { $gte: mStart, $lte: mEnd } }),
        ]);
        monthlyChart.push({
          month: mStart.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
          revenue: rev[0]?.total || 0,
          leads: leadsCount,
        });
      }

      // Status breakdown
      const statusBreakdown = await db.collection('crm_leads').aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      // Recent leads
      const recentLeads = await db.collection('crm_leads').find({}).sort({ createdAt: -1 }).limit(5).toArray();

      return reply.send({
        success: true,
        data: {
          totalLeads,
          newLeadsThisMonth,
          leadsGrowth: newLeadsLastMonth > 0 ? Math.round(((newLeadsThisMonth - newLeadsLastMonth) / newLeadsLastMonth) * 100) : 0,
          totalStudents,
          newStudentsThisMonth,
          totalRevenue,
          revenueThisMonth,
          revenueGrowth: revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : 0,
          conversionRate,
          paidOrders,
          monthlyChart,
          statusBreakdown: statusBreakdown.map((s: any) => ({ status: s._id || 'NEW', count: s.count })),
          recentLeads: recentLeads.map((l: any) => ({
            id: l._id.toString(),
            fullName: l.fullName,
            phone: l.phone,
            email: l.email,
            status: l.status,
            source: l.source,
            courseName: l.courseName,
            createdAt: l.createdAt,
          })),
          upcomingAppointments: upcomingAppointments.map((a: any) => ({
            id: a._id.toString(),
            title: a.title,
            startTime: a.startTime,
            type: a.type,
            status: a.status,
          })),
        }
      });
    } catch (error: any) {
      console.error('CRM stats error:', error);
      return reply.status(500).send({ success: false, message: error.message });
    }
  });

  // GET /api/v1/admin/crm-staff-stats — Staff KPI
  app.get('/crm-staff-stats', { preHandler: [app.authenticate] }, async (request, reply) => {
    try {
      const db = await getDb();
      const staffLeads = await db.collection('crm_leads').aggregate([
        { $match: { assignedTo: { $exists: true, $ne: null } } },
        { $group: {
          _id: '$assignedTo',
          staffName: { $first: '$assignedStaffName' },
          totalLeads: { $sum: 1 },
          wonLeads: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } },
          totalRevenue: { $sum: { $ifNull: ['$finalPrice', 0] } },
        }},
        { $sort: { wonLeads: -1 } }
      ]).toArray();

      return reply.send({
        success: true,
        data: staffLeads.map((s: any) => ({
          staffId: s._id,
          staffName: s.staffName || 'Chưa rõ',
          totalLeads: s.totalLeads,
          wonLeads: s.wonLeads,
          conversionRate: s.totalLeads > 0 ? Math.round((s.wonLeads / s.totalLeads) * 100) : 0,
          totalRevenue: s.totalRevenue,
        }))
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  });
}

