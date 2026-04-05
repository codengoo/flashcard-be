import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: UserDocument): { accessToken: string } {
    const payload: JwtPayload = {
      sub: String(user._id),
      email: user.email,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
