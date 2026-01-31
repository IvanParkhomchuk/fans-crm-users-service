import {Body, Controller, Get, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserDocument} from "./models/user.schema";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.usersService.create(createUserDto);
    }
}
