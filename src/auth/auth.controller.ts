 import {
  Controller,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiOperation({ summary: 'Callback từ Google OAuth, trả về JWT' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về accessToken',
    schema: {
      example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  })
  googleCallback(@Req() req: Request): { accessToken: string } {
    return this.authService.login(req.user as UserDocument);
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
