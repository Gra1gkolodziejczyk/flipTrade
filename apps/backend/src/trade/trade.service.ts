import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTradeDto, UpdateTradeDto } from 'src/types/allTypes.type';
import { calculateTradeResult } from 'src/utils/trade.utils';

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

  async createTrade(userId: string, data: CreateTradeDto) {
    let result = data.result;

    if (data.exit_price !== undefined) {
      result = calculateTradeResult(data.type, data.entry_price, data.exit_price);
    }

    return this.prisma.trade.create({
      data: {
        ...data,
        userId,
        result,
      },
    });
  }

  async updateTrade(id: string, data: UpdateTradeDto, userId: string) {
    return this.prisma.trade.update({
      where: { id, userId },
      data,
    });
  }

  async deleteTrade(id: string, userId: string) {
    return this.prisma.trade.delete({
      where: { id, userId },
    });
  }
}
