import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTradeDto, UpdateTradeDto, JwtUser } from 'src/types/allTypes.type';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTrades(@CurrentUser() user: JwtUser) {
    return this.tradeService.getAllTrades(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTradeById(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ) {
    return this.tradeService.getTradeById(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrade(
    @Body() data: CreateTradeDto,
    @CurrentUser() user: JwtUser
  ) {
    return this.tradeService.createTrade(user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTrade(
    @Param('id') id: string,
    @Body() data: UpdateTradeDto,
    @CurrentUser() user: JwtUser
  ) {
    return this.tradeService.updateTrade(id, data, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTrade(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser
  ) {
    return this.tradeService.deleteTrade(id, user.userId);
  }
}
