import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import { UserDocument } from './models/user.schema';
import { InjectModel } from "@nestjs/mongoose";
import { QueryFilter, Model, Types } from 'mongoose';
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const user = new this.userModel({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
            _id: new Types.ObjectId(),
        });

        try {
            return await user.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User with this email already exists');
            }
            throw error;
        }
    }

    async find(
        filterQuery: QueryFilter<UserDocument>,
        skip: number = 0,
        limit: number = 10
    ): Promise<UserDocument[]> {
        const result = await this.userModel
            .find(filterQuery)
            .skip(skip)
            .limit(limit)
            .lean<UserDocument[]>(true);

        return result;
    }

    async findOne(filterQuery: QueryFilter<UserDocument>): Promise<UserDocument> {
        const userDocument = await this.userModel.findOne(filterQuery).lean<UserDocument>(true);

        if (!userDocument) {
            throw new NotFoundException('User was not found');
        }

        return userDocument;
    }

    async count(filterQuery: QueryFilter<UserDocument>) {
        return this.userModel.countDocuments(filterQuery);
    }
}