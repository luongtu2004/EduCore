const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// URI chuẩn - Bạn hãy copy dòng này vào Compass nếu vẫn không thấy dữ liệu
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("--- BẮT ĐẦU RESET DATABASE ---");
    console.log("URI đang dùng:", uri);

    const db = client.db("EduCore");
    
    // 1. Xóa toàn bộ collection users cũ để làm mới
    try {
      await db.collection("users").drop();
      console.log("- Đã xóa collection users cũ");
    } catch (e) {
      console.log("- Collection users chưa tồn tại, bỏ qua bước xóa");
    }

    // 2. Tạo lại dữ liệu Admin
    const hashedPassword = await bcrypt.hash('123456', 10);
    const usersCol = db.collection("users");
    
    const result = await usersCol.insertOne({
      fullName: 'EduCore Admin',
      email: 'admin@educore.vn',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("- Đã tạo mới tài khoản Admin với ID:", result.insertedId);
    
    const count = await usersCol.countDocuments();
    console.log(`- Kiểm tra cuối cùng: Số lượng users trong DB 'EduCore' là: ${count}`);
    console.log("--- HOÀN TẤT ---");
    console.log("Bây giờ bạn hãy nhấn Refresh trong Compass!");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
