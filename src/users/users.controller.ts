import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {FindFilterDto} from "./dto/find-filter.dto";
import {UserDocument} from "./models/user.schema";
import {PaginatedUsersDto} from "./dto/filtered-users.dto";

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('add-user')
    @UseGuards(JwtAuthGuard)
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserDocument> {
        return this.usersService.create(createUserDto);
    }

    @Get('get-users')
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() findFilterDto: FindFilterDto): Promise<PaginatedUsersDto> {
        return this.usersService.findAll(findFilterDto);
    }

    @Get('get-user/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string): Promise<UserDocument> {
        return this.usersService.findOne(id);
    }
}
