import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TradeResult, TradeType } from '../../generated/prisma';
import { DeviseStatistics, GlobalStatistics, StatisticsByRR, TradeTypeStatistics } from 'src/types/allTypes.type';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcule les statistiques globales pour un utilisateur
   */
  async getGlobalStatistics(userId: string): Promise<GlobalStatistics> {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    if (trades.length === 0) {
      return this.getEmptyStatistics();
    }

    const wins = trades.filter(t => t.result === TradeResult.WIN);
    const losses = trades.filter(t => t.result === TradeResult.LOSS);
    const breakEven = trades.filter(t => t.result === TradeResult.BREAK_EVEN);

    const totalGain = wins.reduce((sum, t) => sum + (t.gain || 0), 0);
    const totalLoss = Math.abs(losses.reduce((sum, t) => sum + (t.loss || 0), 0));
    const netResult = totalGain - totalLoss;

    const avgGainPerWin = wins.length > 0 ? totalGain / wins.length : 0;
    const avgLossPerLoss = losses.length > 0 ? totalLoss / losses.length : 0;

    const profitFactor = totalLoss > 0 ? totalGain / totalLoss : totalGain > 0 ? Infinity : 0;

    const bestTrade = Math.max(...trades.map(t => t.gain || 0));
    const worstTrade = Math.min(...trades.map(t => t.loss || 0));
    const avgTradeResult = netResult / trades.length;

    const consecutiveStats = this.calculateConsecutiveStats(trades);
    const maxDrawdown = this.calculateMaxDrawdown(trades);
    const recoveryFactor = maxDrawdown !== 0 ? netResult / Math.abs(maxDrawdown) : 0;

    return {
      totalTrades: trades.length,
      wins: wins.length,
      losses: losses.length,
      breakEven: breakEven.length,
      winRate: (wins.length / trades.length) * 100,
      lossRate: (losses.length / trades.length) * 100,
      breakEvenRate: (breakEven.length / trades.length) * 100,
      totalGain,
      totalLoss,
      netResult,
      avgGainPerWin,
      avgLossPerLoss,
      profitFactor,
      bestTrade,
      worstTrade,
      avgTradeResult,
      consecutiveWins: consecutiveStats.maxConsecutiveWins,
      consecutiveLosses: consecutiveStats.maxConsecutiveLosses,
      maxDrawdown,
      recoveryFactor,
    };
  }

  /**
   * Calcule les statistiques par Risk/Reward ratio
   */
  async getStatisticsByRR(userId: string): Promise<StatisticsByRR[]> {
    const trades = await this.prisma.trade.findMany({
      where: {
        userId,
        rr: { not: null },
      },
    });

    if (trades.length === 0) {
      return [];
    }

    // Grouper les trades par RR (arrondi à 0.5 près)
    const groupedByRR = trades.reduce((acc, trade) => {
      const roundedRR = Math.round((trade.rr || 0) * 2) / 2; // Arrondi à 0.5 près
      if (!acc[roundedRR]) {
        acc[roundedRR] = [];
      }
      acc[roundedRR].push(trade);
      return acc;
    }, {} as Record<number, typeof trades>);

    return Object.entries(groupedByRR).map(([rr, rrTrades]) => {
      const wins = rrTrades.filter(t => t.result === TradeResult.WIN);
      const losses = rrTrades.filter(t => t.result === TradeResult.LOSS);
      const totalGain = wins.reduce((sum, t) => sum + (t.gain || 0), 0);
      const totalLoss = Math.abs(losses.reduce((sum, t) => sum + (t.loss || 0), 0));

      return {
        rr: parseFloat(rr),
        totalTrades: rrTrades.length,
        wins: wins.length,
        losses: losses.length,
        winRate: (wins.length / rrTrades.length) * 100,
        totalGain,
        totalLoss,
        netResult: totalGain - totalLoss,
      };
    }).sort((a, b) => a.rr - b.rr);
  }

  /**
   * Calcule les statistiques par devise
   */
  async getStatisticsByDevise(userId: string): Promise<DeviseStatistics[]> {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
    });

    if (trades.length === 0) {
      return [];
    }

    const groupedByDevise = trades.reduce((acc, trade) => {
      if (!acc[trade.devise]) {
        acc[trade.devise] = [];
      }
      acc[trade.devise].push(trade);
      return acc;
    }, {} as Record<string, typeof trades>);

    return Object.entries(groupedByDevise).map(([devise, deviseTrades]) => {
      const wins = deviseTrades.filter(t => t.result === TradeResult.WIN);
      const totalGain = wins.reduce((sum, t) => sum + (t.gain || 0), 0);
      const totalLoss = Math.abs(deviseTrades.filter(t => t.result === TradeResult.LOSS).reduce((sum, t) => sum + (t.loss || 0), 0));

      return {
        devise,
        totalTrades: deviseTrades.length,
        winRate: (wins.length / deviseTrades.length) * 100,
        totalGain,
        totalLoss,
        netResult: totalGain - totalLoss,
      };
    });
  }

  /**
   * Calcule les statistiques par type de trade (LONG/SHORT)
   */
  async getStatisticsByTradeType(userId: string): Promise<TradeTypeStatistics[]> {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
    });

    if (trades.length === 0) {
      return [];
    }

    const groupedByType = trades.reduce((acc, trade) => {
      if (!acc[trade.type]) {
        acc[trade.type] = [];
      }
      acc[trade.type].push(trade);
      return acc;
    }, {} as Record<TradeType, typeof trades>);

    return Object.entries(groupedByType).map(([type, typeTrades]) => {
      const wins = typeTrades.filter(t => t.result === TradeResult.WIN);
      const totalGain = wins.reduce((sum, t) => sum + (t.gain || 0), 0);
      const totalLoss = Math.abs(typeTrades.filter(t => t.result === TradeResult.LOSS).reduce((sum, t) => sum + (t.loss || 0), 0));

      return {
        type: type as TradeType,
        totalTrades: typeTrades.length,
        winRate: (wins.length / typeTrades.length) * 100,
        totalGain,
        totalLoss,
        netResult: totalGain - totalLoss,
      };
    });
  }

  /**
   * Trouve le meilleur RR basé sur le taux de réussite
   */
  async getBestRRByWinRate(userId: string): Promise<{ rr: number; winRate: number; totalTrades: number } | null> {
    const statisticsByRR = await this.getStatisticsByRR(userId);

    if (statisticsByRR.length === 0) {
      return null;
    }

    // Filtrer les RR qui ont au moins 5 trades pour avoir des données significatives
    const significantRR = statisticsByRR.filter(stat => stat.totalTrades >= 5);

    if (significantRR.length === 0) {
      return null;
    }

    return significantRR.reduce((best, current) =>
      current.winRate > best.winRate ? current : best,
    );
  }

  /**
   * Trouve le meilleur RR basé sur le profit net
   */
  async getBestRRByProfit(userId: string): Promise<{ rr: number; netResult: number; totalTrades: number } | null> {
    const statisticsByRR = await this.getStatisticsByRR(userId);

    if (statisticsByRR.length === 0) {
      return null;
    }

    // Filtrer les RR qui ont au moins 5 trades pour avoir des données significatives
    const significantRR = statisticsByRR.filter(stat => stat.totalTrades >= 5);

    if (significantRR.length === 0) {
      return null;
    }

    return significantRR.reduce((best, current) =>
      current.netResult > best.netResult ? current : best,
    );
  }

  /**
   * Calcule les statistiques de wins/losses consécutifs
   */
  private calculateConsecutiveStats(trades: any[]): { maxConsecutiveWins: number; maxConsecutiveLosses: number } {
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentConsecutiveWins = 0;
    let currentConsecutiveLosses = 0;

    for (const trade of trades) {
      if (trade.result === TradeResult.WIN) {
        currentConsecutiveWins++;
        currentConsecutiveLosses = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentConsecutiveWins);
      } else if (trade.result === TradeResult.LOSS) {
        currentConsecutiveLosses++;
        currentConsecutiveWins = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentConsecutiveLosses);
      } else {
        currentConsecutiveWins = 0;
        currentConsecutiveLosses = 0;
      }
    }

    return { maxConsecutiveWins, maxConsecutiveLosses };
  }

  /**
   * Calcule le drawdown maximum
   */
  private calculateMaxDrawdown(trades: any[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningBalance = 0;

    for (const trade of trades) {
      const tradeResult = (trade.gain || 0) + (trade.loss || 0);
      runningBalance += tradeResult;

      if (runningBalance > peak) {
        peak = runningBalance;
      }

      const drawdown = peak - runningBalance;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  /**
   * Retourne des statistiques vides
   */
  private getEmptyStatistics(): GlobalStatistics {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      breakEven: 0,
      winRate: 0,
      lossRate: 0,
      breakEvenRate: 0,
      totalGain: 0,
      totalLoss: 0,
      netResult: 0,
      avgGainPerWin: 0,
      avgLossPerLoss: 0,
      profitFactor: 0,
      bestTrade: 0,
      worstTrade: 0,
      avgTradeResult: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      maxDrawdown: 0,
      recoveryFactor: 0,
    };
  }
}
