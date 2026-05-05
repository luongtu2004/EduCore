const { MongoClient } = require('mongodb');

async function run() {
  const c = new MongoClient('mongodb://localhost:27017');
  await c.connect();
  const db = c.db('EduCore');
  const u = await db.collection('users').find({
    $or: [{email: '0354168798'}, {phone: '0354168798'}]
  }).toArray();
  console.log(u);
  process.exit(0);
}

run();
