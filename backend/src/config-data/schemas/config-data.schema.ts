import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDataDocument = ConfigData & Document;

@Schema({ timestamps: true })
export class ConfigData {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  latitude: string;

  @Prop({ required: true })
  longitude: string;
}

export const ConfigDataSchema = SchemaFactory.createForClass(ConfigData);
