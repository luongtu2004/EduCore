const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
  const email = 'admin@educore.vn';
  const password = '123456';

  console.log(`--- Đang thử nghiệm đăng nhập cho: ${email} ---`);

  try {
    // 1. Thử kết nối DB
    console.log('1. Đang kết nối MongoDB...');
    await prisma.$connect();
    console.log('=> Kết nối thành công.');

    // 2. Tìm User
    console.log('2. Đang tìm User trong bảng users...');
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('=> THẤT BẠI: Không tìm thấy User này trong DB.');
      return;
    }
    console.log('=> Tìm thấy User:', user.fullName);

    // 3. Kiểm tra mật khẩu
    console.log('3. Đang kiểm tra mật khẩu...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('=> THẤT BẠI: Mật khẩu không khớp!');
      console.log('Mật khẩu trong DB (hash):', user.password);
    } else {
      console.log('=> THÀNH CÔNG: Mật khẩu chính xác.');
    }

  } catch (error) {
    console.error('=> LỖI NGHIÊM TRỌNG:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
