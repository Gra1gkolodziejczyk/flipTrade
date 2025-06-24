import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../../generated/prisma';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { email: string; id: string }) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: { email: string; username: string; password: string }) {
    if (!user.email || !user.username || !user.password) {
      throw new BadRequestException(
        "L'adresse email et le mot de passe sont obligatoires",
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        "Il y a eu un problème lors de l'inscription",
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      },
    });
    return newUser;
  }
}
