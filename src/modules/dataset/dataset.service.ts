import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from 'src/configurations';
import { GoogleSheetService, IMappingPattern } from '@common/modules';

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

      const enriched = data.map((item: any) => {
        const word = encodeURIComponent(item.word ?? '');
        return {
          ...item,
          tflat_deeplink: `tflat://lookup?word=${word}`,
          cambridge_link: `https://dictionary.cambridge.org/dictionary/english/${word}`,
        };
      });

      return enriched;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch Google Sheet data',
      );
    }
  }
}

