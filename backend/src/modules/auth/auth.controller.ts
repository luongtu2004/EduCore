import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginInput, RefreshTokenInput } from './auth.schema';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    const result = await this.authService.login(request.body);
    return reply.send({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  }

  async logout(request: FastifyRequest<{ Body: RefreshTokenInput }>, reply: FastifyReply) {
    await this.authService.logout(request.body.refreshToken);
    return reply.send({ success: true, message: 'Đăng xuất thành công' });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({
      success: true,
      data: request.user,
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.authService.getAllUsers();
    return reply.send({ success: true, data: users });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.authService.createUser(request.body);
    return reply.status(201).send({ success: true, data: user });
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const user = await this.authService.updateUser(request.params.id, request.body);
    return reply.send({ success: true, data: user });
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    console.log('--- Controller nhận yêu cầu xóa ID:', id);
    
    if (!id) {
      return reply.status(400).send({ success: false, message: 'Thiếu ID nhân viên' });
    }

    await this.authService.deleteUser(id);
    return reply.send({ success: true, message: 'Xóa nhân viên thành công' });
  }
}
