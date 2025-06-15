import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/types/user.type';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Get(':id')
  async getMyProfile(@Param('id') id: string): Promise<User | null> {
    return this.userService.getMyProfile(id);
  }

  @UseGuards(LocalAuthGuard)
  @Patch(':id')
  async updateMyProfile(
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ): Promise<User | null> {
    return this.userService.updateMyProfile(id, data);
  }

  @UseGuards(LocalAuthGuard)
  @Delete(':id')
  async deleteMyProfile(@Param('id') id: string): Promise<User | null> {
    return this.userService.deleteMyProfile(id);
  }
}
