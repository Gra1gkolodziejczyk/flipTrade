'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statsData } from './data/mockStatsData';

export default function StatsDetails() {
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  const formatPercent = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Return
          </span>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              ${formatNumber(statsData.totalReturn)}
            </div>
            <div className="text-xs text-emerald-800">
              {formatPercent(statsData.totalReturnPercent)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Expectancy (Avg Trade)
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            ${formatNumber(statsData.expectancy)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Avg Winner
          </span>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-800">
              ${formatNumber(statsData.avgWinner)}
            </div>
            <div className="text-xs text-emerald-800">
              {formatPercent(statsData.avgWinnerPercent)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Avg Loser
          </span>
          <div className="text-right">
            <div className="text-sm font-medium text-amber-800">
              ${formatNumber(statsData.avgLoser)}
            </div>
            <div className="text-xs text-amber-800">
              {formatPercent(statsData.avgLoserPercent)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Avg Reward/Risk Ratio
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.avgRewardRiskRatio)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Avg R Multiple
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.avgRMultiple)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sum R Multiple
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.sumRMultiple)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Max. Drawdown
          </span>
          <div className="text-sm font-medium text-amber-800">
            {formatPercent(statsData.maxDrawdown)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Profit Factor
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.profitFactor)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sortino
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.sortino)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sharpe
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.sharpe)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Calmar
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.calmar)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">SQN</span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.sqn)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Gain To Pain
          </span>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatNumber(statsData.gainToPain)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
