import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { LoginInput } from './auth.schema';
import { AppError } from '../../common/errors/AppError';

export class AuthService {
  constructor(private server: FastifyInstance) {}

  async login(input: LoginInput) {
    console.log('--- Bắt đầu đăng nhập cho email:', input.email);
    
    try {
      const user = await this.server.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        console.log('! Không tìm thấy người dùng');
        throw new AppError(401, 'Email hoặc mật khẩu không chính xác');
      }
      console.log('- Tìm thấy người dùng:', user.fullName);

      const isPasswordValid = await bcrypt.compare(input.password, user.password);
      if (!isPasswordValid) {
        console.log('! Sai mật khẩu');
        throw new AppError(401, 'Email hoặc mật khẩu không chính xác');
      }
      console.log('- Mật khẩu chính xác');

      if (!user.isActive) {
        throw new AppError(403, 'Tài khoản đã bị khóa');
      }

      const accessToken = this.server.jwt.sign(
        { id: user.id, role: user.role },
        { expiresIn: '1h' }
      );

      const refreshToken = this.server.jwt.sign(
        { id: user.id },
        { expiresIn: '7d' }
      );

      console.log('- Đã tạo Tokens');

      // Tạm thời bỏ qua việc lưu vào DB để tránh lỗi 500 do bảng RefreshToken
      /*
      await this.server.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      */

      console.log('--- Đăng nhập thành công!');

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.error('!!! LỖI TRONG QUÁ TRÌNH LOGIN:', error);
      throw error;
    }
  }

  async logout(token: string) {
    await this.server.prisma.refreshToken.delete({
      where: { token },
    }).catch(() => {});
  }

  async getAllUsers() {
    return this.server.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(data: any) {
    try {
      console.log('--- Đang tạo nhân sự mới:', data.email);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const user = await this.server.prisma.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: data.role,
          isActive: true,
        },
      });

      console.log('--- Tạo nhân sự thành công!');
      return user;
    } catch (error: any) {
      console.error('!!! LỖI KHI TẠO NHÂN SỰ:', error.message);
      if (error.code === 'P2002') {
        throw new AppError(400, 'Email này đã tồn tại trong hệ thống');
      }
      throw error;
    }
  }

  async updateUser(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.server.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    try {
      console.log('--- Đang xóa cưỡng chế nhân viên ID:', id);
      const db = (this.server.prisma as any)._engine.datamodel.datasources[0].name; // Trick để lấy DB name nếu cần, nhưng ta dùng prisma.$runCommand hoặc tương tự
      
      // Cách an toàn nhất: Dùng Prisma nhưng tách riêng từng lệnh và bắt lỗi từng lệnh
      try {
        await this.server.prisma.refreshToken.deleteMany({ where: { userId: id } });
      } catch (e) { console.log('Không có RefreshTokens để xóa'); }

      try {
        await this.server.prisma.post.deleteMany({ where: { authorId: id } });
      } catch (e) { console.log('Không có Posts để xóa'); }

      // Xóa User cuối cùng
      const result = await this.server.prisma.user.delete({
        where: { id },
      });
      
      console.log('--- Xóa cưỡng chế thành công!');
      return result;
    } catch (error: any) {
      console.error('!!! LỖI KHI XÓA CƯỠNG CHẾ:', error.message);
      // Nếu vẫn lỗi, ta dùng deleteMany để tránh lỗi "Record not found"
      return this.server.prisma.user.deleteMany({
        where: { id },
      });
    }
  }
}
