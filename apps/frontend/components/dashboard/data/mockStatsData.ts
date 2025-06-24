export const statsData = {
  totalReturn: 3028.66,
  totalReturnPercent: 9.3,
  expectancy: 164.19,
  avgWinner: 219.21,
  avgWinnerPercent: 2.64,
  avgLoser: -222.87,
  avgLoserPercent: -0.63,
  avgRewardRiskRatio: 7.93,
  avgRMultiple: 5.7,
  sumRMultiple: 208.31,
  maxDrawdown: -1.92,
  maxDrawdownPercent: -1.92,
  profitFactor: 2.24,
  sortino: 0.37,
  sharpe: 0.34,
  calmar: -2.3,
  sqn: 2.92,
  gainToPain: 1.3,
  winRate: 69,
  totalTrades: 36,
  winners: 25,
  losers: 11,
};

export const winRateData = [
  { name: 'Winners', value: statsData.winners, color: '#065f46' },
  { name: 'Losers', value: statsData.losers, color: '#92400e' },
];

export type StatsData = typeof statsData;
export type WinRateData = typeof winRateData;
