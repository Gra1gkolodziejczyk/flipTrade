'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { statsData, winRateData } from './data/mockStatsData';

export default function WinRateChart() {
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
                  data={winRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                >
                  {winRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {statsData.winRate}%
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
                {statsData.winners} W
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-800 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {statsData.losers} L
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
