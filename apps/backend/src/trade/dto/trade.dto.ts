import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Devise, TradeType, TradeResult } from '../../../generated/prisma';

export class CreateTradeDto {
  @IsEnum(Devise)
  @IsNotEmpty()
  devise: Devise;

  @IsEnum(TradeType)
  @IsNotEmpty()
  type: TradeType;

  @IsNumber()
  @IsNotEmpty()
  entry_price: number;

  @IsNumber()
  @IsOptional()
  exit_price?: number;

  @IsNumber()
  @IsOptional()
  stop_loss?: number;

  @IsNumber()
  @IsOptional()
  take_profit?: number;

  @IsNumber()
  @IsOptional()
  rr?: number;

  @IsEnum(TradeResult)
  @IsNotEmpty()
  result: TradeResult;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsOptional()
  gain?: number;

  @IsNumber()
  @IsOptional()
  loss?: number;
}

export class UpdateTradeDto {
  @IsEnum(Devise)
  @IsOptional()
  devise?: Devise;

  @IsEnum(TradeType)
  @IsOptional()
  type?: TradeType;

  @IsNumber()
  @IsOptional()
  entry_price?: number;

  @IsNumber()
  @IsOptional()
  exit_price?: number;

  @IsNumber()
  @IsOptional()
  stop_loss?: number;

  @IsNumber()
  @IsOptional()
  take_profit?: number;

  @IsNumber()
  @IsOptional()
  rr?: number;

  @IsEnum(TradeResult)
  @IsOptional()
  result?: TradeResult;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsOptional()
  gain?: number;

  @IsNumber()
  @IsOptional()
  loss?: number;
}
