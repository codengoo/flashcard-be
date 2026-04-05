import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './configurations/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UsersModule } from './modules/users/users.module';
import { GoogleSheetModule } from './shared';
import { DatasetModule } from './modules/dataset/dataset.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SettingsModule,
    GoogleSheetModule,
    UsersModule,
    AuthModule,
    DatasetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
