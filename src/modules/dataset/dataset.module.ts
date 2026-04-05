import { Module } from '@nestjs/common';
import { GoogleSheetModule } from '@common/modules';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';

@Module({
  imports: [GoogleSheetModule],
  controllers: [DatasetController],
  providers: [DatasetService],
})
export class DatasetModule {}
