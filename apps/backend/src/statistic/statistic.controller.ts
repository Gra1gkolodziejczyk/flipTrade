import { Controller } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtUser } from 'src/types/allTypes.type';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@ApiTags('Statistic')
@ApiBearerAuth()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('all-my-stats')
  async getAllMyStats(@CurrentUser() user: JwtUser) {
    return this.statisticService.getAllMyStats(user);
  }
}
