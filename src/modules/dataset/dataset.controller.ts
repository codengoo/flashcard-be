import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DatasetService } from './dataset.service';

@ApiTags('Dataset')
@Controller('dataset')
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) {}

  @Get('get-from-sheet')
  @ApiOperation({ summary: 'Lấy dữ liệu từ Google Sheet qua module Dataset' })
  @ApiQuery({
    name: 'spreadsheetId',
    required: true,
    description: 'ID của Google Sheet (nằm trong URL chia sẻ)',
  })
  async getFromSheet(@Query('spreadsheetId') spreadsheetId: string) {
    if (!spreadsheetId) {
      throw new BadRequestException('spreadsheetId is required');
    }

    const data = await this.datasetService.getFromSheet(spreadsheetId);
    return {
      success: true,
      data,
    };
  }
}
