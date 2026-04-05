import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/configurations';
import { v7 as uuid } from 'uuid';
import { UserDocument } from '../../schemas';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './strategies/jwt.strategy';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    user: UserDocument,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const config = this.configService.getAuthConfig();
    const jti = uuid();

    const accessToken = this.jwtService.sign(
      { sub: String(user._id), type: 'access', roles: user.roles } as JwtPayload,
      { expiresIn: config.JWT.TTL_TOKEN },
    );
    const refreshToken = this.jwtService.sign(
      { sub: String(user._id), type: 'refresh', jti } as JwtPayload,
      { expiresIn: config.JWT.TTL_REFRESH },
    );

    await this.usersService.updateJti(String(user._id), jti);
    return { accessToken, refreshToken };
  }

  async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findById(decoded.sub);
      if (!user || user.jti !== decoded.jti) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Automatically invalidate old refresh token and issue a new pair (Rotation)
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
