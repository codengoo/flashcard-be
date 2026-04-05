import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Tên hiển thị của user' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Kích hoạt / vô hiệu hoá tài khoản' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
