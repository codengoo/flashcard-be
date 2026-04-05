import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionEnum } from '@common/enums/permission.enum';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PermissionEnum.AssignRoles)
  @Post(':id/roles')
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    const user = await this.usersService.assignRoles(id, assignRolesDto.roles);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
