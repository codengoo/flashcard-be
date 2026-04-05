import { Controller, Post, Body, Param, UseGuards, NotFoundException, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':id/roles')
  async assignRoles(@Param('id') id: string, @Body() assignRolesDto: AssignRolesDto) {
    const user = await this.usersService.assignRoles(id, assignRolesDto.roles);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
