import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class UserDocument {
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true})
    password: string;

    @Prop()
    phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
UserSchema.index({ email: 1 }, { unique: true });
