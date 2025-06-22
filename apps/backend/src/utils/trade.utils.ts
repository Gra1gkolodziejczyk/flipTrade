import { TradeType, TradeResult } from '../../generated/prisma';

export function calculateTradeResult(
  tradeType: TradeType,
  entryPrice: number,
  exitPrice: number,
): TradeResult {
  if (tradeType === TradeType.LONG) {
    return exitPrice > entryPrice ? TradeResult.WIN : TradeResult.LOSS;
  } else if (tradeType === TradeType.SHORT) {
    return exitPrice < entryPrice ? TradeResult.WIN : TradeResult.LOSS;
  }

  // Par défaut, retourner LOSS si le type n'est pas reconnu
  return TradeResult.LOSS;
}
