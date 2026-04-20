const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("--- DANH SÁCH DATABASE TRÊN MÁY BẠN ---");
    
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      // Chỉ in ra các DB có liên quan hoặc có dữ liệu
      if (dbInfo.name !== 'admin' && dbInfo.name !== 'local' && dbInfo.name !== 'config') {
        console.log(`\nDatabase: ${dbInfo.name}`);
        for (const col of collections) {
          const count = await db.collection(col.name).countDocuments();
          console.log(`  - Collection: ${col.name} (${count} bản ghi)`);
        }
      }
    }
    
    console.log("\n--- KẾT THÚC TRUY QUÉT ---");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
