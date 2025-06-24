import RecentTrades from '@/components/dashboard/RecentTrades';

export default function History() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <RecentTrades />
      </div>
    </div>
  );
}
