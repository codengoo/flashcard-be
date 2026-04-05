import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ default: 'system' })
  theme: string;

  @Prop({ default: 'vi' })
  language: string;

  @Prop({ default: 20 })
  dailyGoal: number;

  @Prop({ default: true })
  notificationsEnabled: boolean;

  @Prop({ default: false })
  dataset_sheet_enable: boolean;

  @Prop({ required: false })
  dataset_sheet_id: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
