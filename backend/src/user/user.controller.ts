//backend/src/user/user.controller.ts
import { Controller, Post, Put, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.userService.register(username, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('token') token?: string,
  ) {
    return this.userService.login(username, password, token);
  }

  @Put('change-password')
  async changePassword(
    @Body('username') username: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.changePassword(username, currentPassword, newPassword);
  }

  @Put('update-2fa')
async updateTwoFactorAuth(
  @Body('username') username: string,
  @Body('status') status: string,
) {
  return this.userService.updateTwoFactorAuth(username, status);
}

@Put('reset-2fa')
async resetTwoFactorAuth(@Body('username') username: string) {
  return this.userService.resetTwoFactorAuth(username);
}
}