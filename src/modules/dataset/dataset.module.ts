import { Module } from '@nestjs/common';
import { GoogleSheetModule } from '@common/modules';
import { SettingsModule } from '../settings/settings.module';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';

@Module({
  imports: [GoogleSheetModule, SettingsModule],
  controllers: [DatasetController],
  providers: [DatasetService],
})
export class DatasetModule {}
