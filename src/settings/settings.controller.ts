import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Lấy cài đặt của người dùng' })
  @Get(':userId')
  async getSetting(@Param('userId') userId: string) {
    return this.settingsService.getSetting(userId);
  }

  @ApiOperation({ summary: 'Cập nhật hoặc tạo mới cài đặt của người dùng' })
  @Put(':userId')
  async updateSetting(
    @Param('userId') userId: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.updateSetting(userId, updateSettingDto);
  }
}
