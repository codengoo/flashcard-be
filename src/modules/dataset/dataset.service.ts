import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleSheetService } from '../../shared/google/google-sheet/google-sheet.service';

@Injectable()
export class DatasetService {
  constructor(private readonly googleSheetService: GoogleSheetService) {}

  async getFromSheet(spreadsheetId: string, range?: string) {
    try {
      const client = await this.googleSheetService.getClient();
      const sheetRange = range || 'Sheet1';
      // Return 2D array from sheet
      return await this.googleSheetService.getDataRaw(
        client,
        spreadsheetId,
        sheetRange,
        false, // not raw formulas
      );
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch Google Sheet data',
      );
    }
  }
}
