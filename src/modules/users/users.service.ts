import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

export interface GoogleProfile {
  googleId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOrCreate(profile: GoogleProfile): Promise<UserDocument> {
    const existing = await this.userModel
      .findOne({ googleId: profile.googleId })
      .exec();
    if (existing) {
      return existing;
    }
    const created = new this.userModel(profile);
    return created.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate('roles').exec();
  }

  async updateJti(id: string, jti: string) {
    await this.userModel.updateOne({ _id: id }, { jti: jti }).exec();
  }

  async assignRoles(id: string, roles: string[]): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { roles }, { new: true })
      .populate('roles')
      .exec();
  }
}
