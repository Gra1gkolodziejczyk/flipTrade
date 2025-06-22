import { TradeResult } from '../../generated/prisma';

/**
 * Calcule le pourcentage avec 2 décimales
 */
export function calculatePercentage(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 10000) / 100;
}

/**
 * Calcule le profit factor (Total gains / Total losses)
 */
export function calculateProfitFactor(totalGains: number, totalLosses: number): number {
  if (totalLosses === 0) {
    return totalGains > 0 ? Infinity : 0;
  }
  return Math.round((totalGains / totalLosses) * 100) / 100;
}

/**
 * Calcule l'espérance de gain par trade
 */
export function calculateExpectancy(
  winRate: number,
  avgWin: number,
  avgLoss: number,
): number {
  const lossRate = 100 - winRate;
  const expectancy = ((winRate / 100) * avgWin) - ((lossRate / 100) * Math.abs(avgLoss));
  return Math.round(expectancy * 100) / 100;
}

/**
 * Détermine la catégorie de RR pour grouper les analyses
 */
export function getRRCategory(rr: number): string {
  if (rr < 1) return '< 1:1';
  if (rr < 1.5) return '1:1 - 1.5:1';
  if (rr < 2) return '1.5:1 - 2:1';
  if (rr < 3) return '2:1 - 3:1';
  if (rr < 5) return '3:1 - 5:1';
  return '> 5:1';
}

/**
 * Calcule la série de gains/pertes consécutives
 */
export function calculateConsecutiveSeries(trades: any[]): {
  currentStreak: { type: 'WIN' | 'LOSS' | 'NONE'; count: number };
  maxWinStreak: number;
  maxLossStreak: number;
} {
  if (trades.length === 0) {
    return {
      currentStreak: { type: 'NONE', count: 0 },
      maxWinStreak: 0,
      maxLossStreak: 0,
    };
  }

  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  // Calculer les séries
  for (const trade of trades) {
    if (trade.result === TradeResult.WIN) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (trade.result === TradeResult.LOSS) {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  }

  // Déterminer la série actuelle
  const lastTrade = trades[trades.length - 1];
  let currentStreak: { type: 'WIN' | 'LOSS' | 'NONE'; count: number };

  if (lastTrade.result === TradeResult.WIN) {
    currentStreak = { type: 'WIN', count: currentWinStreak };
  } else if (lastTrade.result === TradeResult.LOSS) {
    currentStreak = { type: 'LOSS', count: currentLossStreak };
  } else {
    currentStreak = { type: 'NONE', count: 0 };
  }

  return {
    currentStreak,
    maxWinStreak,
    maxLossStreak,
  };
}

/**
 * Calcule les métriques de risque
 */
export function calculateRiskMetrics(trades: any[]): {
  maxDrawdown: number;
  maxDrawdownDuration: number;
  recoveryFactor: number;
  sharpeRatio: number;
} {
  if (trades.length === 0) {
    return {
      maxDrawdown: 0,
      maxDrawdownDuration: 0,
      recoveryFactor: 0,
      sharpeRatio: 0,
    };
  }

  let peak = 0;
  let maxDrawdown = 0;
  let maxDrawdownDuration = 0;
  let currentDrawdownDuration = 0;
  let runningBalance = 0;
  let returns: number[] = [];

  for (const trade of trades) {
    const tradeResult = (trade.gain || 0) + (trade.loss || 0);
    runningBalance += tradeResult;
    returns.push(tradeResult);

    if (runningBalance > peak) {
      peak = runningBalance;
      currentDrawdownDuration = 0;
    } else {
      currentDrawdownDuration++;
    }

    const drawdown = peak - runningBalance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }

    maxDrawdownDuration = Math.max(maxDrawdownDuration, currentDrawdownDuration);
  }

  // Calcul du Sharpe Ratio simplifié
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;

  const totalReturn = runningBalance;
  const recoveryFactor = maxDrawdown !== 0 ? totalReturn / maxDrawdown : 0;

  return {
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    maxDrawdownDuration,
    recoveryFactor: Math.round(recoveryFactor * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
  };
}

/**
 * Identifie les patterns de trading
 */
export function identifyTradingPatterns(trades: any[]): {
  morningTrades: number;
  afternoonTrades: number;
  eveningTrades: number;
  weekdayTrades: number;
  weekendTrades: number;
  bestPerformingHour: number | null;
  worstPerformingHour: number | null;
} {
  if (trades.length === 0) {
    return {
      morningTrades: 0,
      afternoonTrades: 0,
      eveningTrades: 0,
      weekdayTrades: 0,
      weekendTrades: 0,
      bestPerformingHour: null,
      worstPerformingHour: null,
    };
  }

  let morningTrades = 0;
  let afternoonTrades = 0;
  let eveningTrades = 0;
  let weekdayTrades = 0;
  let weekendTrades = 0;

  // Performance par heure
  const hourlyPerformance: { [hour: number]: { total: number; count: number } } = {};

  for (const trade of trades) {
    const tradeDate = new Date(trade.createdAt);
    const hour = tradeDate.getHours();
    const dayOfWeek = tradeDate.getDay();
    const tradeResult = (trade.gain || 0) + (trade.loss || 0);

    // Classification par moment de la journée
    if (hour >= 6 && hour < 12) {
      morningTrades++;
    } else if (hour >= 12 && hour < 18) {
      afternoonTrades++;
    } else {
      eveningTrades++;
    }

    // Classification jour de semaine vs weekend
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      weekdayTrades++;
    } else {
      weekendTrades++;
    }

    // Performance par heure
    if (!hourlyPerformance[hour]) {
      hourlyPerformance[hour] = { total: 0, count: 0 };
    }
    hourlyPerformance[hour].total += tradeResult;
    hourlyPerformance[hour].count++;
  }

  // Trouver la meilleure et pire heure
  let bestPerformingHour: number | null = null;
  let worstPerformingHour: number | null = null;
  let bestAvgPerformance = -Infinity;
  let worstAvgPerformance = Infinity;

  for (const [hour, data] of Object.entries(hourlyPerformance)) {
    const avgPerformance = data.total / data.count;

    if (avgPerformance > bestAvgPerformance) {
      bestAvgPerformance = avgPerformance;
      bestPerformingHour = parseInt(hour);
    }

    if (avgPerformance < worstAvgPerformance) {
      worstAvgPerformance = avgPerformance;
      worstPerformingHour = parseInt(hour);
    }
  }

  return {
    morningTrades,
    afternoonTrades,
    eveningTrades,
    weekdayTrades,
    weekendTrades,
    bestPerformingHour,
    worstPerformingHour,
  };
}

/**
 * Calcule des statistiques avancées
 */
export function calculateAdvancedStatistics(trades: any[]): {
  averageHoldingTime: number; // en heures
  winLossRatio: number;
  largestWin: number;
  largestLoss: number;
  averageWinSize: number;
  averageLossSize: number;
  profitabilityRatio: number;
} {
  if (trades.length === 0) {
    return {
      averageHoldingTime: 0,
      winLossRatio: 0,
      largestWin: 0,
      largestLoss: 0,
      averageWinSize: 0,
      averageLossSize: 0,
      profitabilityRatio: 0,
    };
  }

  const wins = trades.filter(t => t.result === TradeResult.WIN);
  const losses = trades.filter(t => t.result === TradeResult.LOSS);

  // Calculs des gains/pertes
  const winAmounts = wins.map(t => t.gain || 0);
  const lossAmounts = losses.map(t => Math.abs(t.loss || 0));

  const largestWin = winAmounts.length > 0 ? Math.max(...winAmounts) : 0;
  const largestLoss = lossAmounts.length > 0 ? Math.max(...lossAmounts) : 0;
  const averageWinSize = winAmounts.length > 0 ?
    winAmounts.reduce((sum, win) => sum + win, 0) / winAmounts.length : 0;
  const averageLossSize = lossAmounts.length > 0 ?
    lossAmounts.reduce((sum, loss) => sum + loss, 0) / lossAmounts.length : 0;

  // Win/Loss ratio
  const winLossRatio = losses.length > 0 ? wins.length / losses.length : wins.length;

  // Temps de détention moyen (simplifié - assume que les trades durent quelques heures)
  const averageHoldingTime = 2; // Placeholder - nécessiterait des données sur l'ouverture/fermeture

  // Ratio de profitabilité
  const profitabilityRatio = averageLossSize > 0 ? averageWinSize / averageLossSize : averageWinSize;

  return {
    averageHoldingTime: Math.round(averageHoldingTime * 100) / 100,
    winLossRatio: Math.round(winLossRatio * 100) / 100,
    largestWin: Math.round(largestWin * 100) / 100,
    largestLoss: Math.round(largestLoss * 100) / 100,
    averageWinSize: Math.round(averageWinSize * 100) / 100,
    averageLossSize: Math.round(averageLossSize * 100) / 100,
    profitabilityRatio: Math.round(profitabilityRatio * 100) / 100,
  };
}
