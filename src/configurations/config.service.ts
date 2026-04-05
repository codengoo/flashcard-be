import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfig } from '@nestjs/config';
import config from 'config';
require('dotenv').config();

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfig) {}

  getDBConfig() {
    return {
      MONGODB: {
        URI:
          this.configService.getOrThrow<string>('MONGODB_URI') ||
          config.get('mongodb.uri'),
      },
    };
  }

  getGoogleConfig() {
    return {
      GOOGLE: {
        CLIENT_SECRET: this.configService.getOrThrow<string>(
          'GOOGLE_CLIENT_SECRET',
        ),
        CLIENT_ID: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
        CALLBACK_URL:
          this.configService.get<string>('GOOGLE_CALLBACK_URL') ||
          config.get('google.callback_url') ||
          '',
      },
    };
  }

  getAuthConfig() {
    return {
      JWT: {
        SECRET: this.configService.getOrThrow<string>('JWT_SECRET'),
        TTL_TOKEN: config.get<number>('jwt.ttl_token'),
        TTL_REFRESH: config.get<number>('jwt.ttl_refresh'),
      },
      COOKIE: {
        TTL_TOKEN: config.get<number>('jwt.ttl_token_cookie'),
        TTL_REFRESH: config.get<number>('jwt.ttl_refresh_cookie'),
      },
    };
  }

  getConfig() {
    return {
      ...this.getDBConfig(),
      ...this.getGoogleConfig(),
      ...this.getAuthConfig(),
    };
  }
}
