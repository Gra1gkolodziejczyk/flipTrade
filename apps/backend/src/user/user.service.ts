import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });
    return user;
  }

  async updateMyProfile(
    userId: string,
    data: Partial<User>,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return user;
  }

  async deleteMyProfile(userId: string): Promise<String> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return 'User deleted successfully';
  }
}
