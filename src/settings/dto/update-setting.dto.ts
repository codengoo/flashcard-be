import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingDto {
  @ApiPropertyOptional({ description: 'Giao diện của ứng dụng', example: 'dark' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ description: 'Ngôn ngữ ưu tiên', example: 'vi' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Mục tiêu học thẻ hằng ngày', example: 30 })
  @IsOptional()
  @IsNumber()
  dailyGoal?: number;

  @ApiPropertyOptional({ description: 'Có bật thông báo hay không', example: true })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;
}
