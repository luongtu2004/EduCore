const { MongoClient } = require('mongodb');
require('dotenv').config();

async function check() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();
  const coupon = await db.collection('cms_coupons').findOne({ code: 'DEMO50' });
  console.log('Coupon found:', coupon);
  await client.close();
}
check();
