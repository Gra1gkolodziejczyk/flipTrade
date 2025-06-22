import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}
}