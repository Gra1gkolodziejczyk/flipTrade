import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [AuthController, UserController],
  providers: [],
})
export class AppModule {}
