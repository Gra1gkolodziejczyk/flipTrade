import { Injectable } from '@nestjs/common';
import { TradeResult } from 'generated/prisma';
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

  async getDailyTradesSummary(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: {
        userId,
      },
      select: {
        gain: true,
        loss: true,
        result: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Grouper les trades par jour
    const dailyResults: Record<
      string,
      { totalResult: number; trades: number }
    > = {};

    trades.forEach((trade) => {
      // Formater la date au format YYYY-MM-DD
      const dateKey = trade.createdAt.toISOString().split('T')[0];

      if (!dailyResults[dateKey]) {
        dailyResults[dateKey] = { totalResult: 0, trades: 0 };
      }

      // Calculer le résultat basé sur gain/loss
      const tradeResult = (trade.gain || 0) - (trade.loss || 0);
      dailyResults[dateKey].totalResult += tradeResult;
      dailyResults[dateKey].trades += 1;
    });

    // Convertir en format final avec win/loss
    const summary = Object.entries(dailyResults).map(([date, data]) => ({
      date,
      isWin: data.totalResult > 0,
      isLoss: data.totalResult < 0,
      totalResult: Number(data.totalResult.toFixed(2)),
      tradesCount: data.trades,
    }));

    return summary.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async getWinLossRatio(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
    });

    const winTrades = trades.filter(
      (trade) => trade.result === TradeResult.WIN,
    );
    const lossTrades = trades.filter(
      (trade) => trade.result === TradeResult.LOSS,
    );

    const totalTrades = trades.length;
    const winCount = winTrades.length;
    const lossCount = lossTrades.length;

    const winRatio = totalTrades > 0 ? winCount / totalTrades : 0;
    const lossRatio = totalTrades > 0 ? lossCount / totalTrades : 0;
    const winRatePercentage =
      totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0;

    return {
      winRatio,
      lossRatio,
      winCount,
      lossCount,
      totalTrades,
      winRatePercentage,
    };
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
      result = calculateTradeResult(
        data.type,
        data.entry_price,
        data.exit_price,
      );
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
