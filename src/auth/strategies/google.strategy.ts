import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from 'src/configurations';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const config = configService.getGoogleConfig();
    super({
      clientID: config.GOOGLE.CLIENT_ID,
      clientSecret: config.GOOGLE.CLIENT_SECRET,
      callbackURL: config.GOOGLE.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, name, emails, photos } = profile;
    const user = await this.usersService.findOrCreate({
      googleId: id,
      email: emails?.[0]?.value ?? '',
      displayName: profile.displayName,
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
      avatar: photos?.[0]?.value ?? '',
    });
    done(null, user);
  }
}
