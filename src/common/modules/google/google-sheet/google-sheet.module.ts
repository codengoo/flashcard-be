import { Module } from '@nestjs/common';
import { GoogleApiModule } from '../google-api/google-api.module';
import { GoogleSheetService } from './google-sheet.service';

@Module({
  imports: [GoogleApiModule],
  providers: [GoogleSheetService],
  exports: [GoogleSheetService, GoogleApiModule],
})
export class GoogleSheetModule {}
