'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { Loader2 } from 'lucide-react';

interface DailySummary {
  date: string;
  isWin: boolean;
  isLoss: boolean;
  totalResult: number;
  tradesCount: number;
}

export default function ProfitCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const fetchDailySummaries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token || !isAuthenticated) {
        throw new Error('Utilisateur non authentifié');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trade/daily-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const data: DailySummary[] = await response.json();
      setDailySummaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDailySummaries();
    }
  }, [isAuthenticated, token]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dayNumber: prevDate.getDate(),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        dayNumber: day,
      });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dayNumber: nextDate.getDate(),
      });
    }

    return days;
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTradeData = (date: Date) => {
    const key = getDateKey(date);
    const summary = dailySummaries.find(s => s.date === key);

    if (!summary) {
      return {
        profit: 0,
        trades: 0,
      };
    }

    return {
      profit: summary.totalResult,
      trades: summary.tradesCount,
    };
  };

  const getCellStyle = (profit: number, trades: number) => {
    if (trades === 0) {
      return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
    }
    if (profit > 0) {
      return 'bg-emerald-800 dark:bg-emerald-800 text-white';
    } else {
      return 'bg-amber-800 dark:bg-amber-800 text-white';
    }
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Calendrier des Profits
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Calendrier des Profits
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Erreur: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              className="h-8 w-8 text-gray-500 bg-white border border-gray-600 hover:bg-gray-100 hover:border-gray-700 hover:cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 text-gray-500 bg-white border border-gray-600 hover:bg-gray-100 hover:border-gray-700 hover:cursor-pointer hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:hover:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const tradeData = getTradeData(day.date);
            const cellStyle = getCellStyle(tradeData.profit, tradeData.trades);

            return (
              <div
                key={index}
                className={`
                  relative h-20 rounded-lg border border-gray-300 dark:border-gray-600 p-2 cursor-pointer
                  transition-all duration-200 hover:scale-105 hover:shadow-md
                  ${cellStyle}
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                `}
                title={`${day.date.toLocaleDateString('fr-FR')} - ${tradeData.profit >= 0 ? '+' : ''}${tradeData.profit.toFixed(2)}€ (${tradeData.trades} trades)`}
              >
                <div className="text-sm font-semibold mb-1">
                  {day.dayNumber}
                </div>
                {tradeData.trades > 0 && (
                  <>
                    <div className="text-xs font-medium">
                      {tradeData.profit >= 0 ? '+' : ''}
                      {tradeData.profit.toFixed(0)}€
                    </div>
                    <div className="text-xs opacity-75">
                      {tradeData.trades} trade{tradeData.trades > 1 ? 's' : ''}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              No trades
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-800 dark:bg-emerald-800 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Profit
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-800 dark:bg-amber-800 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Loss
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
