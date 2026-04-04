import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async getSetting(userId: string): Promise<Setting> {
    let setting = await this.settingModel.findOne({ userId }).exec();
    if (!setting) {
      // Create a default setting if not exists
      setting = await this.settingModel.create({ userId });
    }
    return setting;
  }

  async updateSetting(
    userId: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const setting = await this.settingModel
      .findOneAndUpdate({ userId }, updateSettingDto, {
        new: true,
        upsert: true,
      })
      .exec();
    return setting;
  }
}
