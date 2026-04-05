import { Permissions } from '@common/decorators';
import { PermissionEnum } from '@common/enums';
import { PermissionsGuard } from '@common/guards';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions(PermissionEnum.ModifyPermissions)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permissions(PermissionEnum.ReadPermissions)
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Permissions(PermissionEnum.ReadPermissions)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  @Permissions(PermissionEnum.ModifyPermissions)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.ModifyPermissions)
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
