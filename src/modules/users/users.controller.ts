import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionEnum } from '@common/enums/permission.enum';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions(PermissionEnum.ReadUsers)
  @ApiOperation({ summary: 'Lấy danh sách tất cả users' })
  @ApiResponse({ status: 200, description: 'Danh sách users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions(PermissionEnum.ReadUsers)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một user' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của user' })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  @Patch(':id')
  @Permissions(PermissionEnum.ModifyUsers)
  @ApiOperation({ summary: 'Cập nhật thông tin user (displayName, isActive)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của user' })
  @ApiResponse({ status: 200, description: 'User đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, dto);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  @Post(':id/roles')
  @Permissions(PermissionEnum.AssignRoles)
  @ApiOperation({ summary: 'Gán roles cho user' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId của user' })
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
