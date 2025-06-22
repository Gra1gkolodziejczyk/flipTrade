import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  StatisticService,
} from './statistic.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeviseStatistics, GlobalStatistics, StatisticsByRR, TradeTypeStatistics, JwtUser } from 'src/types/allTypes.type';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  /**
   * Récupère les statistiques globales de l'utilisateur
   * GET /statistic/global
   */
  @UseGuards(JwtAuthGuard)
  @Get('global')
  async getGlobalStatistics(@CurrentUser() user: JwtUser): Promise<GlobalStatistics> {
    return await this.statisticService.getGlobalStatistics(user.userId);
  }

  /**
   * Récupère les statistiques par Risk/Reward ratio
   * GET /statistic/by-rr
   */
  @UseGuards(JwtAuthGuard)
  @Get('by-rr')
  async getStatisticsByRR(@CurrentUser() user: JwtUser): Promise<StatisticsByRR[]> {
    return await this.statisticService.getStatisticsByRR(user.userId);
  }

  /**
   * Récupère les statistiques par devise
   * GET /statistic/by-devise
   */
  @UseGuards(JwtAuthGuard)
  @Get('by-devise')
  async getStatisticsByDevise(@CurrentUser() user: JwtUser): Promise<DeviseStatistics[]> {
    return await this.statisticService.getStatisticsByDevise(user.userId);
  }

  /**
   * Récupère les statistiques par type de trade (LONG/SHORT)
   * GET /statistic/by-trade-type
   */
  @UseGuards(JwtAuthGuard)
  @Get('by-trade-type')
  async getStatisticsByTradeType(@CurrentUser() user: JwtUser): Promise<TradeTypeStatistics[]> {
    return await this.statisticService.getStatisticsByTradeType(user.userId);
  }

  /**
   * Récupère le meilleur RR basé sur le taux de réussite
   * GET /statistic/best-rr-winrate
   */
  @UseGuards(JwtAuthGuard)
  @Get('best-rr-winrate')
  async getBestRRByWinRate(@CurrentUser() user: JwtUser) {
    return await this.statisticService.getBestRRByWinRate(user.userId);
  }

  /**
   * Récupère le meilleur RR basé sur le profit net
   * GET /statistic/best-rr-profit
   */
  @UseGuards(JwtAuthGuard)
  @Get('best-rr-profit')
  async getBestRRByProfit(@CurrentUser() user: JwtUser) {
    return await this.statisticService.getBestRRByProfit(user.userId);
  }

  /**
   * Récupère un résumé complet des statistiques
   * GET /statistic/summary
   */
  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async getStatisticsSummary(@CurrentUser() user: JwtUser) {
    const [
      global,
      byRR,
      byDevise,
      byTradeType,
      bestRRWinRate,
      bestRRProfit,
    ] = await Promise.all([
      this.statisticService.getGlobalStatistics(user.userId),
      this.statisticService.getStatisticsByRR(user.userId),
      this.statisticService.getStatisticsByDevise(user.userId),
      this.statisticService.getStatisticsByTradeType(user.userId),
      this.statisticService.getBestRRByWinRate(user.userId),
      this.statisticService.getBestRRByProfit(user.userId),
    ]);

    return {
      global,
      analysis: {
        byRR,
        byDevise,
        byTradeType,
        bestPerformance: {
          bestRRByWinRate: bestRRWinRate,
          bestRRByProfit: bestRRProfit,
        },
      },
    };
  }
}
