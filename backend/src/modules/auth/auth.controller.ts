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
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
    });

    res.setHeader('Authorization', `Bearer ${result.accessToken}`);

    return res.json({
      success: true,
      message: 'Login successful',
      data: null,
    });
  }


  @Post('refresh')
  async refresh(@Req() req, @Res() res) {
    const result = await this.authService.refresh(req.cookies.refreshToken);

    res.setHeader('Authorization', `Bearer ${result.data.accessToken}`);

    return res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: null,
    });
  }
}