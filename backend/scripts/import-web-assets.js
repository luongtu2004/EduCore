const { MongoClient } = require('mongodb');
require('dotenv').config();

async function importAssets() {
  const client = new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/EduCore?directConnection=true");
  try {
    await client.connect();
    const db = client.db();
    
    console.log('--- SCANNING WEB ASSETS ---');
    
    const mediaItems = [];
    
    // 1. Get images from Banners
    const banners = await db.collection('cms_banners').find({}).toArray();
    banners.forEach(b => {
      if (b.imageUrl) {
        mediaItems.push({
          fileName: b.imageUrl.split('/').pop() || 'banner-image',
          url: b.imageUrl,
          size: 1024 * 500, // Mock size
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // 2. Get images from Posts
    const posts = await db.collection('cms_posts').find({}).toArray();
    posts.forEach(p => {
      if (p.thumbnail) {
        mediaItems.push({
          fileName: p.thumbnail.split('/').pop() || 'post-thumbnail',
          url: p.thumbnail,
          size: 1024 * 300,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // 3. Get images from Testimonials
    const testimonials = await db.collection('cms_testimonials').find({}).toArray();
    testimonials.forEach(t => {
      if (t.image) {
        mediaItems.push({
          fileName: t.image.split('/').pop() || 'student-avatar',
          url: t.image,
          size: 1024 * 100,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // Remove duplicates by URL
    const uniqueMedia = [];
    const urls = new Set();
    for (const item of mediaItems) {
      if (!urls.has(item.url)) {
        urls.add(item.url);
        uniqueMedia.push(item);
      }
    }

    if (uniqueMedia.length > 0) {
      // Clear existing media to avoid duplicates if re-running
      // await db.collection('media').deleteMany({}); 
      
      for (const item of uniqueMedia) {
        await db.collection('media').updateOne(
          { url: item.url },
          { $setOnInsert: item },
          { upsert: true }
        );
      }
      console.log(`Successfully imported ${uniqueMedia.length} assets into Media Library!`);
    } else {
      console.log('No assets found to import.');
    }

  } catch (error) {
    console.error('Error importing assets:', error);
  } finally {
    await client.close();
  }
}

importAssets();
