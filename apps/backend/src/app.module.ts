import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TradeModule } from './trade/trade.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, TradeModule, StatisticModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
