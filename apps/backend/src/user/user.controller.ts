import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from 'src/types/allTypes.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMyProfile(
    @Param('id') id: string,
  ): Promise<Omit<User, 'password'> | null> {
    return this.userService.getMyProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMyProfile(
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ): Promise<Omit<User, 'password'> | null> {
    return this.userService.updateMyProfile(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMyProfile(@Param('id') id: string): Promise<String> {
    return this.userService.deleteMyProfile(id);
  }
}
