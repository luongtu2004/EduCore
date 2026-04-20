const { MongoClient } = require('mongodb');

async function clean() {
  const client = new MongoClient('mongodb://localhost:27017/EduCore');
  try {
    await client.connect();
    const db = client.db();
    const courses = db.collection('courses');
    
    // Find broken docs
    const all = await courses.find().toArray();
    console.log('Total courses before cleanup:', all.length);
    
    const broken = all.filter(c => !c.title || !c.slug);
    console.log('Broken courses found:', broken.length);
    
    if (broken.length > 0) {
      const ids = broken.map(b => b._id);
      const result = await courses.deleteMany({ _id: { $in: ids } });
      console.log('Successfully deleted:', result.deletedCount);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

clean();
