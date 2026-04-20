const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("EduCore");
    const usersCol = db.collection("users");

    console.log("--- ĐANG NẠP DANH SÁCH NHÂN VIÊN MẪU ---");

    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const staffList = [
      { fullName: 'Nguyễn Văn Admin', email: 'admin@educore.vn', role: 'ADMIN' },
      { fullName: 'Trần Thị Tuyển Sinh', email: 'tuyensinh1@educore.vn', role: 'STAFF' },
      { fullName: 'Lê Văn Tư Vấn', email: 'tuvan1@educore.vn', role: 'CONSULTANT' },
      { fullName: 'Phạm Thị Kế Toán', email: 'ketoan1@educore.vn', role: 'STAFF' },
      { fullName: 'Hoàng Văn Giáo Viên', email: 'giaovien1@educore.vn', role: 'TEACHER' },
      { fullName: 'Đặng Thị Marketing', email: 'marketing1@educore.vn', role: 'STAFF' },
      { fullName: 'Bùi Văn Kỹ Thuật', email: 'kythuat1@educore.vn', role: 'STAFF' },
      { fullName: 'Ngô Thị Nhân Sự', email: 'nhansu1@educore.vn', role: 'ADMIN' },
      { fullName: 'Lý Văn Bảo Vệ', email: 'baove1@educore.vn', role: 'STAFF' },
      { fullName: 'Vũ Thị Trợ Giảng', email: 'trogiang1@educore.vn', role: 'TEACHER' },
      { fullName: 'Trịnh Văn Quản Lý', email: 'quanly1@educore.vn', role: 'ADMIN' },
      { fullName: 'Mai Thị Đào Tạo', email: 'daotao1@educore.vn', role: 'TEACHER' },
      { fullName: 'Đỗ Văn Sale', email: 'sale1@educore.vn', role: 'CONSULTANT' },
      { fullName: 'Hồ Thị Tài Chính', email: 'taichinh1@educore.vn', role: 'STAFF' },
      { fullName: 'Phan Văn Công Nghệ', email: 'it1@educore.vn', role: 'STAFF' }
    ];

    for (const staff of staffList) {
      await usersCol.updateOne(
        { email: staff.email },
        { 
          $set: {
            ...staff,
            password: hashedPassword,
            isActive: Math.random() > 0.1, // 90% hoạt động
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    console.log(`- Đã nạp thành công ${staffList.length} nhân viên.`);
    console.log("--- HOÀN TẤT ---");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
