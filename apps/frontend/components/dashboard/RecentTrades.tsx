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
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';

// Types basés sur la structure de l'API backend
interface ApiTrade {
  id: string;
  devise: 'EUR_USD' | 'BTC_USD' | 'XAUUSD';
  type: 'LONG' | 'SHORT';
  entry_price: number;
  exit_price?: number;
  result: 'WIN' | 'LOSS' | 'BREAK_EVEN';
  gain?: number;
  loss?: number;
  createdAt: string;
  updatedAt: string;
}

// Type pour l'affichage dans le composant
interface DisplayTrade {
  id: string;
  entryDate: string;
  exitDate: string;
  instrument: string;
  result: 'Profit' | 'Loss' | 'Break Even';
  pnl: number;
  type: 'Long' | 'Short';
}

// URL de base de l'API (même configuration que dans auth-provider)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RecentTrades() {
  const { token, isAuthenticated } = useAuth();
  const [trades, setTrades] = useState<DisplayTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTrades();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(`${API_BASE_URL}/trade`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des trades');
      }

      const apiTrades: ApiTrade[] = await response.json();

      // Transformation des données de l'API vers le format d'affichage
      const displayTrades: DisplayTrade[] = apiTrades
        .slice(0, 10) // Limiter aux 10 derniers
        .map(trade => ({
          id: trade.id,
          entryDate: new Date(trade.createdAt).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          exitDate: new Date(trade.updatedAt).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          instrument: formatDevise(trade.devise),
          result: formatResult(trade.result),
          pnl: calculatePnL(trade),
          type: trade.type === 'LONG' ? 'Long' : 'Short',
        }));

      setTrades(displayTrades);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const formatDevise = (devise: string): string => {
    switch (devise) {
      case 'EUR_USD':
        return 'EUR/USD';
      case 'BTC_USD':
        return 'BTC/USD';
      case 'XAUUSD':
        return 'XAU/USD';
      default:
        return devise;
    }
  };

  const formatResult = (result: string): 'Profit' | 'Loss' | 'Break Even' => {
    switch (result) {
      case 'WIN':
        return 'Profit';
      case 'LOSS':
        return 'Loss';
      case 'BREAK_EVEN':
        return 'Break Even';
      default:
        return 'Break Even';
    }
  };

  const calculatePnL = (trade: ApiTrade): number => {
    if (trade.result === 'WIN' && trade.gain) {
      return trade.gain;
    } else if (trade.result === 'LOSS' && trade.loss) {
      return -Math.abs(trade.loss);
    }
    return 0;
  };

  const formatPnL = (pnl: number) => {
    const formatted = pnl.toFixed(2);
    return pnl >= 0 ? `+$${formatted}` : `-$${Math.abs(pnl).toFixed(2)}`;
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0
      ? 'text-emerald-800 dark:text-emerald-800'
      : 'text-amber-800 dark:text-amber-800';
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Derniers trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Vous devez être connecté pour voir vos trades
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Derniers trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Chargement des trades...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Derniers trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500 dark:text-red-400">
              Erreur: {error}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trades.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Derniers trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Aucun trade trouvé
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              {trades.map(trade => (
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
                          : trade.result === 'Loss'
                            ? 'text-amber-800 border-amber-800'
                            : 'text-gray-600 border-gray-600'
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
