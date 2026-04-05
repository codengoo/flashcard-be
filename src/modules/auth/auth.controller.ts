import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ConfigService } from 'src/configurations';
import type { UserDocument } from '../../schemas/user.schema';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  setupCookie(res: Response, access_token: string, refresh_token: string) {
    const isSecure = process.env.NODE_ENV === 'production';
    const config = this.configService.getAuthConfig();

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: config.COOKIE.TTL_TOKEN,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: config.COOKIE.TTL_REFRESH,
    });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Redirect tới trang đăng nhập Google' })
  @ApiResponse({ status: 302, description: 'Chuyển hướng đến Google OAuth' })
  googleLogin(): void {
    // Guard handles redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Callback từ Google OAuth, cấu hình cookies' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, thiết lập cookies',
  })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as UserDocument;
    const token = await this.authService.login(user);
    this.setupCookie(res, token.accessToken, token.refreshToken);

    return { message: 'Logged in successfully' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy lại access token mới dùng refresh token' })
  @ApiResponse({ status: 200, description: 'Cấp mới tokens và lưu cookies' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const token = await this.authService.refreshToken(refreshToken);
    this.setupCookie(res, token.accessToken, token.refreshToken);

    return { message: 'Tokens refreshed' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin người dùng đang đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin user hiện tại',
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  getProfile(@Req() req: Request): UserDocument {
    return req.user as UserDocument;
  }
}
