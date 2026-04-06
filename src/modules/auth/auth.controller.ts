import { Controller, Post, Body, Res, Req,  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'strict',
    });

    return res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  }


  @Post('refresh')
  refresh(@Req() req) {
    return this.authService.refresh(req.cookies.refreshToken);
  }
}