import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Trade } from 'src/types/user.type';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getAllTrades(@Param('userId') userId: string) {
    return this.tradeService.getAllTrades(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/:id')
  async getTradeById(@Param('userId') userId: string, @Param('id') id: string) {
    return this.tradeService.getTradeById(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrade(@Body() data: Trade, @Query('userId') userId: string) {
    return this.tradeService.createTrade(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTrade(@Param('id') id: string, @Body() data: Trade) {
    return this.tradeService.updateTrade(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTrade(@Param('id') id: string) {
    return this.tradeService.deleteTrade(id);
  }
}
