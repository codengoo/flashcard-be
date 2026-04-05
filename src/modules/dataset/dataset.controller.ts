import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettingsService } from '../settings/settings.service';
import { DatasetService } from './dataset.service';

@ApiTags('Dataset')
@Controller('dataset')
export class DatasetController {
  constructor(
    private readonly datasetService: DatasetService,
    private readonly settingsService: SettingsService,
  ) {}

  @Get('get-from-sheet')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy dữ liệu từ Google Sheet qua module Dataset' })
  @ApiQuery({
    name: 'spreadsheetId',
    required: false,
    description: 'ID của Google Sheet (nằm trong URL chia sẻ)',
  })
  async getFromSheet(
    @Req() req: any,
    @Query('spreadsheetId') reqSpreadsheetId?: string,
  ) {
    let spreadsheetId = reqSpreadsheetId;
    if (!spreadsheetId) {
      const settings = await this.settingsService.getSetting(
        req.user._id || req.user.sub,
      );
      if (!settings?.dataset_sheet_enable) {
        throw new BadRequestException(
          'dataset_sheet_enable is disabled in settings',
        );
      }
      if (!settings?.dataset_sheet_id) {
        throw new BadRequestException(
          'dataset_sheet_id is not configured in settings',
        );
      }
      spreadsheetId = settings.dataset_sheet_id;
    }

    const data = await this.datasetService.getFromSheet(spreadsheetId);
    return {
      success: true,
      data,
    };
  }
}
