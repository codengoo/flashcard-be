import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { GoogleSheetService } from './google-sheet.service';

@ApiTags('Google Sheet')
@Controller('google-sheet')
export class GoogleSheetController {
  constructor(private readonly googleSheetService: GoogleSheetService) {}

  @Get(':spreadsheetId/data')
  @ApiOperation({ summary: 'Lấy dữ liệu từ Google Sheet (mảng 2 chiều)' })
  @ApiParam({
    name: 'spreadsheetId',
    description: 'ID của Google Sheet (nằm trong URL chia sẻ)',
  })
  @ApiQuery({
    name: 'range',
    required: false,
    description: 'Phạm vi lấy dữ liệu, mặc định: Sheet1',
    example: 'Sheet1!A1:D10',
  })
  @ApiResponse({ status: 200, description: 'Trả về dữ liệu dạng mảng 2 chiều' })
  @ApiResponse({ status: 400, description: 'Thiếu Spreadsheet ID' })
  @ApiResponse({ status: 500, description: 'Lỗi trong quá trình lấy dữ liệu' })
  async getSheetData(
    @Param('spreadsheetId') spreadsheetId: string,
    @Query('range') range?: string,
  ) {
    if (!spreadsheetId) {
      throw new BadRequestException('Spreadsheet ID is required');
    }

    try {
      const sheetRange = range || 'Sheet1';
      const data = await this.googleSheetService.getSheetData(
        spreadsheetId,
        sheetRange,
      );
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch Google Sheet data',
      );
    }
  }
}
