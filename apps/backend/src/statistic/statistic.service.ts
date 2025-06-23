import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtUser } from 'src/types/allTypes.type';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMyStats(user: JwtUser) {
    return this.prisma.statistics.findMany({
      where: {
        userId: user.userId,
      },
    });
  }
}
