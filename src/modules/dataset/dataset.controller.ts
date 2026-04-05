import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'range',
    required: false,
    description: 'Phạm vi lấy dữ liệu, mặc định là Sheet1',
    example: 'Sheet1!A1:D10',
  })
  @ApiResponse({ status: 200, description: 'Trả về dữ liệu dạng mảng 2 chiều' })
  async getFromSheet(
    @Query('spreadsheetId') spreadsheetId: string,
    @Query('range') range?: string,
  ) {
    if (!spreadsheetId) {
      throw new BadRequestException('spreadsheetId is required');
    }

    const data = await this.datasetService.getFromSheet(spreadsheetId, range);
    return {
      success: true,
      data,
    };
  }
}
