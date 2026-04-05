import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from 'src/configurations';
import { GoogleSheetService, IMappingPattern } from '../../shared';

const transform = [
  { field: 'Word', key: 'word' },
  { field: 'Meaning', key: 'meaning' },
  { field: 'Example', key: 'example' },
] as const satisfies IMappingPattern[];

@Injectable()
export class DatasetService {
  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly config: ConfigService,
  ) {}

  async getFromSheet(spreadsheetId: string) {
    try {
      const client = await this.googleSheetService.getClient();
      const data = await this.googleSheetService.getDataPattern(
        client,
        spreadsheetId,
        'Card 1',
        transform,
      );

      return data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch Google Sheet data',
      );
    }
  }
}
