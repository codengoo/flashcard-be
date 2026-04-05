import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'permission:read',
    description: 'Read permission only',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Permission to read users',
    description: 'The description of the permission',
  })
  description?: string;
}
