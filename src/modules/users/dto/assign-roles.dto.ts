import { IsArray, IsMongoId } from 'class-validator';

export class AssignRolesDto {
  @IsArray()
  @IsMongoId({ each: true })
  roles: string[];
}
