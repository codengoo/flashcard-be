import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingDto {
  @ApiPropertyOptional({
    description: 'Giao diện của ứng dụng',
    example: 'dark',
  })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ description: 'Ngôn ngữ ưu tiên', example: 'vi' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Mục tiêu học thẻ hằng ngày',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  dailyGoal?: number;

  @ApiPropertyOptional({
    description: 'Có bật thông báo hay không',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Bật lấy dataset từ Google Sheet',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  dataset_sheet_enable?: boolean;

  @ApiPropertyOptional({
    description: 'ID của Google Sheet',
    example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  })
  @IsOptional()
  @IsString()
  dataset_sheet_id?: string;
}
