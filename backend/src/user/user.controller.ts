import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../common/decorators/public.decorator'; // This should work now

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public() // Use this to skip auth guard
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
) {
    return this.userService.login(username, password); // Make sure this line calls the service
}
}
