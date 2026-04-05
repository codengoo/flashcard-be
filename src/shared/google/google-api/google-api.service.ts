import { Injectable } from '@nestjs/common';
import { AuthClient, GoogleAuth, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class GoogleApiService {
  private readonly googleAuth: GoogleAuth<AuthClient>;
  private readonly DEFAULT_SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
  ];
  constructor() {
    const SERVICE_ACCOUNT_FILENAME = process.env.SERVICE_ACCOUNT_FILENAME;
    if (SERVICE_ACCOUNT_FILENAME) {
      this.googleAuth = new google.auth.GoogleAuth({
        keyFilename: `./${SERVICE_ACCOUNT_FILENAME}`,
        scopes: this.DEFAULT_SCOPES,
      });
    } else {
      this.googleAuth = new google.auth.GoogleAuth({
        scopes: this.DEFAULT_SCOPES,
      });
    }
  }

  public async getGoogleClient(accessToken?: string) {
    if (accessToken) {
      const authClient = new google.auth.OAuth2();
      authClient.setCredentials({ access_token: accessToken });
      return authClient;
    } else {
      return this.googleAuth.getClient() as Promise<OAuth2Client>;
    }
  }
}
