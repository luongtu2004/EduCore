const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixStudents() {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('crm_students');
    
    console.log('--- Đang kiểm tra dữ liệu học viên...');
    const students = await collection.find({}).toArray();
    console.log(`- Tìm thấy ${students.length} học viên.`);

    for (const student of students) {
      const updates = {};
      if (student.fullName === null || student.fullName === undefined) updates.fullName = "Học viên mới";
      if (student.phone === null || student.phone === undefined) updates.phone = "0000000000";
      
      if (Object.keys(updates).length > 0) {
        console.log(`- Cập nhật học viên ID: ${student._id}`);
        await collection.updateOne({ _id: student._id }, { $set: updates });
      }
    }
    console.log('--- Hoàn tất sửa lỗi dữ liệu!');
  } catch (error) {
    console.error('Lỗi khi sửa dữ liệu:', error);
  } finally {
    await client.close();
  }
}

fixStudents();
