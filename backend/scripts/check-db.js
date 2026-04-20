const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb://localhost:27017/EduCore?directConnection=true";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("EduCore");
    const usersCol = db.collection("users");

    console.log("--- KIỂM TRA DATABASE ---");
    
    // 1. Kiểm tra xem có bao nhiêu users
    const count = await usersCol.countDocuments();
    console.log(`Số lượng nhân viên hiện có: ${count}`);

    // 2. Nếu chưa có hoặc muốn nạp lại
    const hashedPassword = await bcrypt.hash('123456', 10);
    const adminEmail = 'admin@educore.vn';
    
    console.log(`Đang đảm bảo tài khoản ${adminEmail} tồn tại...`);
    
    await usersCol.updateOne(
      { email: adminEmail },
      { 
        $set: {
          fullName: 'EduCore Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // 3. In ra danh sách Email để bạn xác nhận
    const allUsers = await usersCol.find({}).toArray();
    console.log("Danh sách các email nhân viên trong DB:");
    allUsers.forEach(u => console.log(`- ${u.email} (ID: ${u._id})`));

    console.log("--- HOÀN TẤT ---");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
