import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from 'src/common/enums/gender-enum';

export type ContactDocument = HydratedDocument<Contact> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, enum: ['M', 'F', 'O'] })
  gender: Gender;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
