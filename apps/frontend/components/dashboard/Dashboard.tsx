'use client';

import { useAuth, ProtectedRoute } from '@/lib/auth-provider';
import ProfitCalendar from './ProfitCalendar';
import StatsDetails from './StatsDetails';
import PerformanceChart from './PerformanceChart';
import RecentTrades from './RecentTrades';
import WinRateChart from './WinRateChart';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <WinRateChart />
          </div>
          <div className="lg:col-span-3">
            <PerformanceChart />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
          <div className="xl:col-span-1">
            <StatsDetails />
          </div>
          <div className="xl:col-span-3">
            <ProfitCalendar />
          </div>
        </div>
        <div>
          <RecentTrades />
        </div>
      </div>
    </div>
  );
}
