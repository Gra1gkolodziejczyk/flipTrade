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

export type { User, Trade };
