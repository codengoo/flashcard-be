import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionEnum } from '@common/enums/permission.enum';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Lấy cài đặt của người dùng hiện tại' })
  @Get()
  async getMySetting(@Req() req: any) {
    return this.settingsService.getSetting(req.user._id || req.user.sub);
  }

  @ApiOperation({
    summary: 'Cập nhật hoặc tạo mới cài đặt của người dùng hiện tại',
  })
  @Put()
  async updateMySetting(
    @Req() req: any,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.updateSetting(
      req.user._id || req.user.sub,
      updateSettingDto,
    );
  }

  @ApiOperation({ summary: 'Lấy cài đặt của người dùng theo ID (Admin)' })
  @Permissions(PermissionEnum.ReadSettings)
  @Get(':userId')
  async getSetting(@Param('userId') userId: string) {
    return this.settingsService.getSetting(userId);
  }

  @ApiOperation({
    summary: 'Cập nhật hoặc tạo mới cài đặt của người dùng theo ID (Admin)',
  })
  @Permissions(PermissionEnum.UpdateSettings)
  @Put(':userId')
  async updateSetting(
    @Param('userId') userId: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.updateSetting(userId, updateSettingDto);
  }
}
