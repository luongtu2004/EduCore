const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../backend/.env' });

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true";
const client = new MongoClient(uri);

async function seedCoupons() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('cms_coupons');

    const coupons = [
      {
        code: 'EDUCORE2026',
        discount: '20%',
        type: 'PERCENT',
        expiry: new Date('2026-12-31'),
        usageCount: 45,
        maxUsage: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'HELLO-SPRING',
        discount: '500.000đ',
        type: 'FIXED',
        expiry: new Date('2026-05-01'),
        usageCount: 12,
        maxUsage: 50,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'WELCOME-NEWBIE',
        discount: '15%',
        type: 'PERCENT',
        expiry: new Date('2026-06-30'),
        usageCount: 88,
        maxUsage: 200,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'WINTER-OFF',
        discount: '10%',
        type: 'PERCENT',
        expiry: new Date('2025-12-31'),
        usageCount: 100,
        maxUsage: 100,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear existing coupons first if you want a clean seed
    // await collection.deleteMany({});

    const result = await collection.insertMany(coupons);
    console.log(`${result.insertedCount} coupons inserted!`);

  } finally {
    await client.close();
  }
}

seedCoupons().catch(console.error);
