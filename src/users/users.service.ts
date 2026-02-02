import {Injectable, UnauthorizedException} from '@nestjs/common';
import { UserDocument } from "./models/user.schema";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        return this.usersRepository.create(createUserDto);
    }

    async findAll() {
        return this.usersRepository.find({});
    }

    async findOne(_id: string) {
        return this.usersRepository.findOne({ _id });
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            throw new UnauthorizedException(`Credentials are not valid.`);
        }

        return user;
    }
}
