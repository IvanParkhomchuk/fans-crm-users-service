import {Injectable, UnauthorizedException} from '@nestjs/common';
import { UserDocument } from "./models/user.schema";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from 'bcryptjs';
import {FindFilterDto} from "./dto/find-filter.dto";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        return this.usersRepository.create(createUserDto);
    }

    async findAll(findFilterDto: FindFilterDto) {
        const page = findFilterDto.page ?? 1;
        const perPage = findFilterDto.perPage ?? 10;
        const { name, email, phone } = findFilterDto;

        console.log('SERVICE: Received DTO:', findFilterDto);
        console.log('SERVICE: page =', page, 'perPage =', perPage);

        const filterQuery: any = {};

        if (name) {
            filterQuery.name = { $regex: name, $options: 'i' };
        }
        if (email) {
            filterQuery.email = { $regex: email, $options: 'i' };
        }
        if (phone) {
            filterQuery.phone = { $regex: phone, $options: 'i' };
        }

        const skip = (page - 1) * perPage;

        console.log('SERVICE: Calling repository with skip =', skip, 'limit =', perPage);

        const [users, total] = await Promise.all([
            this.usersRepository.find(filterQuery, skip, perPage),
            this.usersRepository.count(filterQuery),
        ]);

        console.log('SERVICE: Received users count:', users.length);

        return {
            data: users,
            meta: {
                total,
                page,
                perPage,
            },
        };
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
