import { Module } from '@nestjs/common';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';
import { GoogleSheetModule } from '../../shared';

@Module({
  imports: [GoogleSheetModule],
  controllers: [DatasetController],
  providers: [DatasetService]
})
export class DatasetModule {}
