'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-provider';

interface WinLossData {
  winRatio: number;
  lossRatio: number;
  winCount: number;
  lossCount: number;
  totalTrades: number;
  winRatePercentage: number;
}

export default function WinRateChart() {
  const { token, isAuthenticated } = useAuth();
  const [winLossData, setWinLossData] = useState<WinLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWinLossData = async () => {
      try {
        if (!isAuthenticated || !token) {
          throw new Error('Utilisateur non authentifié');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/trade/win-loss-ratio`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            'Erreur API:',
            response.status,
            response.statusText,
            errorText,
          );
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();
        if (!responseText) {
          throw new Error("Réponse vide de l'API");
        }

        let data: WinLossData;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError);
          console.error('Réponse reçue:', responseText);
          throw new Error("Réponse invalide de l'API");
        }
        setWinLossData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue',
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchWinLossData();
    } else {
      setLoading(false);
      setError('Utilisateur non authentifié');
    }
  }, [token, isAuthenticated]);

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-1 min-h-[240px]">
          <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !winLossData) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-1 min-h-[240px]">
          <div className="text-red-500 dark:text-red-400">
            {error || 'Aucune donnée disponible'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: 'Winners', value: winLossData.winCount, color: '#065f46' },
    { name: 'Losers', value: winLossData.lossCount, color: '#92400e' },
  ];

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 min-h-[240px]">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {winLossData.winRatePercentage}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Winrate
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-800 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {winLossData.winCount} W
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-800 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {winLossData.lossCount} L
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
