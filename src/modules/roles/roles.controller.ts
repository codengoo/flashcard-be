import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '@common/decorators';
import { PermissionEnum } from '@common/enums';
import { PermissionsGuard } from '@common/guards';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(PermissionEnum.ModifyRoles)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions(PermissionEnum.ReadRoles)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions(PermissionEnum.ReadRoles)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @Permissions(PermissionEnum.ModifyRoles)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.ModifyRoles)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
