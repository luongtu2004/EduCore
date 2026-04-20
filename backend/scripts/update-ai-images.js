const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateData() {
  const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true");
  try {
    await client.connect();
    const db = client.db();
    
    console.log('--- UPDATING DATA WITH AI IMAGES ---');
    
    // 1. Register in media collection
    const newMedia = [
      {
        fileName: 'ai-hero.png',
        url: '/uploads/ai-hero.png',
        size: 1024 * 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fileName: 'ielts-prep.png',
        url: '/uploads/ielts-prep.png',
        size: 1024 * 700,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const m of newMedia) {
      await db.collection('media').updateOne(
        { url: m.url },
        { $set: m },
        { upsert: true }
      );
    }

    // 2. Update some posts to use these images instead of picsum
    // Let's find posts with picsum URLs and replace them
    const postsToUpdate = await db.collection('cms_posts').find({ thumbnail: /picsum/ }).limit(10).toArray();
    
    for (let i = 0; i < postsToUpdate.length; i++) {
      const img = i % 2 === 0 ? '/uploads/ai-hero.png' : '/uploads/ielts-prep.png';
      await db.collection('cms_posts').updateOne(
        { _id: postsToUpdate[i]._id },
        { $set: { thumbnail: img } }
      );
    }

    console.log(`Updated ${postsToUpdate.length} posts with high-quality AI images!`);

  } catch (error) {
    console.error('Error updating data:', error);
  } finally {
    await client.close();
  }
}

updateData();
