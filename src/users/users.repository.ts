import { Injectable } from "@nestjs/common";
import { UserDocument } from './models/user.schema';
import { InjectModel } from "@nestjs/mongoose";
import {Model, Types} from 'mongoose';
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const user = new this.userModel({
            ...createUserDto,
            _id: new Types.ObjectId(),
        });

        return (await user.save()).toJSON as unknown as UserDocument;
    }
}