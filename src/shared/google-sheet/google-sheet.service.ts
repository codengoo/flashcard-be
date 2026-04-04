import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleSheetService {
  private readonly logger = new Logger(GoogleSheetService.name);
  private sheets: any;

  constructor(private configService: ConfigService) {
    this.initializeGoogleSheets();
  }

  private initializeGoogleSheets() {
    const clientEmail = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
    const privateKey = this.configService
      .get<string>('GOOGLE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log(
        'Google Sheets API initialized via service account credentials.',
      );
    } else {
      // Allow fallback to standard environment GOOGLE_APPLICATION_CREDENTIALS or unauthenticated options
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.warn(
        'Google Sheets API initialized without explicit credentials (falling back to application default credentials).',
      );
    }
  }

  async getSheetData(
    spreadsheetId: string,
    range: string,
  ): Promise<string[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values || [];
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch data from spreadsheet ${spreadsheetId}: ${error.message}`,
      );
      throw error;
    }
  }
}
