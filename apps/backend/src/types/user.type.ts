import { PenisSize } from '../../generated/prisma';

type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  penis_size: PenisSize | null;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type { User };
