import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findAll(@Query() query: GetUsersFilterDto) {
        return this.usersService.findAll(query);
    }
}
