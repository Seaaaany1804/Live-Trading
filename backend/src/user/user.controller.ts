import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
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
}
