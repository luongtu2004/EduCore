const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanup() {
  const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true");
  try {
    await client.connect();
    const db = client.db();
    
    // Remove broken blog placeholders
    const result = await db.collection('media').deleteMany({
      url: { $regex: /blog-.*\.png/ }
    });
    console.log(`Removed ${result.deletedCount} broken blog placeholders.`);

    // Also remove Unsplash URLs that are not actually images (if any)
    // But my new regex should handle them now.

  } catch (error) {
    console.error('Error cleaning up media:', error);
  } finally {
    await client.close();
  }
}

cleanup();
