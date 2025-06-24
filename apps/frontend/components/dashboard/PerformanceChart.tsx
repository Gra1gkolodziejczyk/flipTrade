'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { performanceData } from './data/mockPerformanceData';

export default function PerformanceChart() {
  return (
    <Card className="bg-white w-full dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance par Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `$${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{`Date: ${label}`}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {`Profit: $${payload[0].value?.toFixed(2)}`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#065f46"
                strokeWidth={2}
                dot={{
                  fill: '#065f46',
                  strokeWidth: 2,
                  r: 4,
                  stroke: '#065f46',
                }}
                activeDot={{ r: 6, stroke: '#065f46', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
