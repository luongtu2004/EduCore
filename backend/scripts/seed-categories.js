const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/EduCore';
const client = new MongoClient(uri);

async function seedCategories() {
  try {
    await client.connect();
    const db = client.db('EduCore');
    const categoriesCol = db.collection('cms_categories');

    const categories = [
      { name: 'Kinh nghiệm học tập', slug: 'kinh-nghiem-hoc-tap' },
      { name: 'Tin tức sự kiện', slug: 'tin-tuc-su-kien' },
      { name: 'Góc học viên', slug: 'goc-hoc-vien' }
    ];

    for (const cat of categories) {
      const exists = await categoriesCol.findOne({ slug: cat.slug });
      if (!exists) {
        await categoriesCol.insertOne({
          ...cat,
          createdAt: new Date()
        });
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category exists: ${cat.name} (${exists._id})`);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seedCategories();
