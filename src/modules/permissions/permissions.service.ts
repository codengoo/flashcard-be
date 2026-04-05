import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from '../../schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<PermissionDocument> {
    const existing = await this.permissionModel.findOne({ name: createPermissionDto.name }).exec();
    if (existing) {
      throw new ConflictException('Permission with this name already exists');
    }
    const created = new this.permissionModel(createPermissionDto);
    return created.save();
  }

  async findAll(): Promise<PermissionDocument[]> {
    return this.permissionModel.find().exec();
  }

  async findOne(id: string): Promise<PermissionDocument> {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDocument> {
    const updated = await this.permissionModel
      .findByIdAndUpdate(id, updatePermissionDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
  }
}
