import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Role description',
    example: 'The highest role in system',
  })
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Permission list',
    example: [],
  })
  permissions?: string[];
}
