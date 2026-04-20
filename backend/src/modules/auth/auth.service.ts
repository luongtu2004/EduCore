import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { LoginInput } from './auth.schema';
import { AppError } from '../../common/errors/AppError';

import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { LoginInput } from './auth.schema';
import { AppError } from '../../common/errors/AppError';
import { MongoClient, ObjectId } from 'mongodb';

export class AuthService {
  private mongoClient: MongoClient;

  constructor(private server: FastifyInstance) {
    this.mongoClient = new MongoClient(process.env.DATABASE_URL || '');
  }

  async login(input: LoginInput) {
    console.log('--- Bắt đầu đăng nhập cho email:', input.email);
    
    try {
      await this.mongoClient.connect();
      const db = this.mongoClient.db();
      const user = await db.collection('users').findOne({ email: input.email });

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
        { id: user._id.toString(), role: user.role },
        { expiresIn: '1h' }
      );

      const refreshToken = this.server.jwt.sign(
        { id: user._id.toString() },
        { expiresIn: '7d' }
      );

      console.log('--- Đăng nhập thành công!');

      return {
        user: {
          id: user._id.toString(),
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
    // Tạm thời bỏ qua xóa refreshToken trong DB
  }

  async getAllUsers() {
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
    return users.map(u => ({
      ...u,
      id: u._id.toString()
    }));
  }

  async createUser(data: any) {
    try {
      console.log('--- Đang tạo nhân sự mới:', data.email);
      await this.mongoClient.connect();
      const db = this.mongoClient.db();
      
      const existing = await db.collection('users').findOne({ email: data.email });
      if (existing) throw new AppError(400, 'Email này đã tồn tại trong hệ thống');

      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const result = await db.collection('users').insertOne({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('--- Tạo nhân sự thành công!');
      return { id: result.insertedId, ...data };
    } catch (error: any) {
      console.error('!!! LỖI KHI TẠO NHÂN SỰ:', error.message);
      throw error;
    }
  }

  async updateUser(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    await this.mongoClient.connect();
    const db = this.mongoClient.db();
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) as any },
      { $set: { ...data, updatedAt: new Date() } }
    );
    return { success: true };
  }

  async deleteUser(id: string) {
    try {
      console.log('--- Đang xóa cưỡng chế nhân viên ID:', id);
      await this.mongoClient.connect();
      const db = this.mongoClient.db();
      
      await db.collection('refresh_tokens').deleteMany({ userId: id });
      await db.collection('posts').deleteMany({ authorId: id });
      await db.collection('users').deleteOne({ _id: new ObjectId(id) as any });
      
      console.log('--- Xóa cưỡng chế thành công!');
      return { success: true };
    } catch (error: any) {
      console.error('!!! LỖI KHI XÓA CƯỠNG CHẾ:', error.message);
      throw error;
    }
  }
}
