import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Trade } from 'src/types/user.type';

@Injectable()
export class TradeService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTrades(userId: string) {
    return this.prisma.trade.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async getTradeById(userId: string, id: string) {
    return this.prisma.trade.findUnique({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async createTrade(userId: string, data: Trade) {
    return this.prisma.trade.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateTrade(id: string, data: Trade) {
    return this.prisma.trade.update({
      where: { id },
      data,
    });
  }

  async deleteTrade(id: string) {
    return this.prisma.trade.delete({
      where: { id },
    });
  }
}
