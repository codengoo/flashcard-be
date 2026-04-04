import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetService } from './google-sheet.service';
import { GoogleSheetController } from './google-sheet.controller';

@Module({
  imports: [ConfigModule],
  controllers: [GoogleSheetController],
  providers: [GoogleSheetService],
  exports: [GoogleSheetService],
})
export class GoogleSheetModule {}
