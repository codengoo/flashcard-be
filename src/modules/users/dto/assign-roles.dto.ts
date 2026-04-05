import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class AssignRolesDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({
    description: 'Role name list',
    example: [],
  })
  roles: string[];
}
