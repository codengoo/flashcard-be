import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfig } from '@nestjs/config';
const config = require('config');
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

  getJwtConfig() {
    return {
      JWT: {
        SECRET: this.configService.getOrThrow<string>('JWT_SECRET'),
      },
    };
  }

  getConfig() {
    return {
      ...this.getDBConfig(),
      ...this.getGoogleConfig(),
      ...this.getJwtConfig(),
    };
  }
}
