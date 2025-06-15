-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "TradeResult" AS ENUM ('WIN', 'LOSS', 'BREAK_EVEN');

-- CreateEnum
CREATE TYPE "Devise" AS ENUM ('EUR_USD', 'BTC_USD', 'XAUUSD');

-- CreateEnum
CREATE TYPE "PenisSize" AS ENUM ('SMALL', 'AVERAGE', 'LARGE', 'EXTRA_LARGE', 'GRAIG_SIZE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "firstname" TEXT,
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "penis_size" "PenisSize";

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "devise" "Devise" NOT NULL,
    "type" "TradeType" NOT NULL,
    "entry_price" DOUBLE PRECISION NOT NULL,
    "exit_price" DOUBLE PRECISION,
    "stop_loss" DOUBLE PRECISION,
    "take_profit" DOUBLE PRECISION,
    "rr" DOUBLE PRECISION,
    "result" "TradeResult" NOT NULL,
    "comment" TEXT,
    "gain" DOUBLE PRECISION,
    "loss" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "total_trades" INTEGER NOT NULL DEFAULT 0,
    "win_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avgRR" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalGainRR" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalLossRR" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalGain" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalLoss" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trade_userId_idx" ON "Trade"("userId");

-- CreateIndex
CREATE INDEX "Trade_createdAt_idx" ON "Trade"("createdAt");

-- CreateIndex
CREATE INDEX "Statistics_userId_idx" ON "Statistics"("userId");

-- CreateIndex
CREATE INDEX "Statistics_createdAt_idx" ON "Statistics"("createdAt");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
