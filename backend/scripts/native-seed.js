const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("EduCore");
    console.log("Đang gieo dữ liệu Nhân viên...");

    const users = db.collection("users");
    
    // Xóa users cũ (tùy chọn, nếu bạn muốn làm sạch)
    // await users.deleteMany({});

    const hashedPassword = await bcrypt.hash('123456', 10);

    const staffData = [
      {
        fullName: 'EduCore Admin',
        email: 'admin@educore.vn',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Nguyễn Thị Tuyển Sinh',
        email: 'tuyensinh@educore.vn',
        password: hashedPassword,
        role: 'STAFF',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Lê Văn Giáo Viên',
        email: 'giaovien@educore.vn',
        password: hashedPassword,
        role: 'TEACHER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Trần Văn Kế Toán',
        email: 'ketoan@educore.vn',
        password: hashedPassword,
        role: 'STAFF',
        isActive: false, // Thử nghiệm trạng thái bị khóa
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const staff of staffData) {
      await users.updateOne({ email: staff.email }, { $set: staff }, { upsert: true });
    }

    console.log("Đã gieo dữ liệu 4 nhân viên mẫu thành công!");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
