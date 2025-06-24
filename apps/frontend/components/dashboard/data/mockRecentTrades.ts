export const recentTrades = [
  {
    id: 1,
    entryDate: '2024-02-28 16:30',
    exitDate: '2024-02-28 16:45',
    instrument: 'EUR/USD',
    result: 'Profit' as const,
    pnl: 132.15,
    type: 'Long' as const,
  },
  {
    id: 2,
    entryDate: '2024-02-28 16:30',
    exitDate: '2024-02-29 18:45',
    instrument: 'EUR/USD',
    result: 'Profit' as const,
    pnl: 544.44,
    type: 'Long' as const,
  },
  {
    id: 3,
    entryDate: '2024-02-27 21:08',
    exitDate: '2024-02-28 23:05',
    instrument: 'USD/JPY',
    result: 'Loss' as const,
    pnl: -259.08,
    type: 'Short' as const,
  },
  {
    id: 4,
    entryDate: '2024-02-26 18:07',
    exitDate: '2024-02-29 21:13',
    instrument: 'EUR/USD',
    result: 'Profit' as const,
    pnl: 271.32,
    type: 'Long' as const,
  },
  {
    id: 5,
    entryDate: '2024-02-25 08:01',
    exitDate: '2024-02-26 09:21',
    instrument: 'YM',
    result: 'Profit' as const,
    pnl: 150.0,
    type: 'Long' as const,
  },
];

export type Trade = {
  id: number;
  entryDate: string;
  exitDate: string;
  instrument: string;
  result: 'Profit' | 'Loss';
  pnl: number;
  type: 'Long' | 'Short';
};
