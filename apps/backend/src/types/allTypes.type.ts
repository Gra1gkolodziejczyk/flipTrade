import {
  Devise,
  PenisSize,
  TradeResult,
  TradeType,
} from '../../generated/prisma';

type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  penis_size: PenisSize | null;
  balance: GLfloat;
  createdAt: Date;
  updatedAt: Date;
};

type JwtUser = {
  userId: string;
  email: string;
};

// Type complet pour un Trade (retourné par l'API)
type Trade = {
  id: string;
  userId: User['id'];
  devise: Devise;
  type: TradeType;
  entry_price: GLfloat;
  exit_price: GLfloat;
  stop_loss: GLfloat;
  take_profit: GLfloat;
  rr: GLfloat;
  result: TradeResult;
  comment?: string;
  gain: GLfloat;
  loss: GLfloat;
  createdAt: Date;
  updatedAt: Date;
};

// DTO pour créer un nouveau trade (sans les champs auto-générés)
type CreateTradeDto = {
  devise: Devise;
  type: TradeType;
  entry_price: GLfloat;
  exit_price?: GLfloat;
  stop_loss?: GLfloat;
  take_profit?: GLfloat;
  rr?: GLfloat;
  result: TradeResult;
  comment?: string;
  gain?: GLfloat;
  loss?: GLfloat;
};

// DTO pour mettre à jour un trade (tous les champs optionnels sauf les identifiants)
type UpdateTradeDto = Partial<Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

export type { User, Trade, JwtUser, CreateTradeDto, UpdateTradeDto };
