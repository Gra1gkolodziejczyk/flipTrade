'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { recentTrades } from './data/mockRecentTrades';

export default function RecentTrades() {
  const formatPnL = (pnl: number) => {
    const formatted = pnl.toFixed(2);
    return pnl >= 0 ? `+$${formatted}` : `-$${Math.abs(pnl).toFixed(2)}`;
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0
      ? 'text-emerald-800 dark:text-emerald-800'
      : 'text-amber-800 dark:text-amber-800';
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Derniers trades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                  Date d&apos;entrée
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                  Date de sortie
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                  Devise
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                  Type de trade
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                  Résultat
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-400 font-medium text-right">
                  P&L
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map(trade => (
                <TableRow
                  key={trade.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="text-sm text-gray-900 dark:text-white">
                    {trade.entryDate}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 dark:text-white">
                    {trade.exitDate}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 dark:text-white font-medium">
                    {trade.instrument}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium border rounded ${
                        trade.type === 'Long'
                          ? 'text-emerald-800 border-emerald-800'
                          : 'text-amber-800 border-amber-800'
                      }`}
                    >
                      {trade.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium border rounded ${
                        trade.result === 'Profit'
                          ? 'text-emerald-800 border-emerald-800'
                          : 'text-amber-800 border-amber-800'
                      }`}
                    >
                      {trade.result}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-sm font-medium text-right ${getPnLColor(trade.pnl)}`}
                  >
                    {formatPnL(trade.pnl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
