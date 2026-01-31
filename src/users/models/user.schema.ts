import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class UserDocument {
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
