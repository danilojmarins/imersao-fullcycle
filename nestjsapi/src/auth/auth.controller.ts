import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInfoDto } from './dto/login-info.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginInfo: LoginInfoDto) {
    return this.authService.login(loginInfo.email, loginInfo.password);
  }
}
