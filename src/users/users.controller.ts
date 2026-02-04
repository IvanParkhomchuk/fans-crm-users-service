import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {FindFilterDto} from "./dto/find-filter.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    // @TODO: Add Guard?
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() findFilterDto: FindFilterDto) {
        console.log('CONTROLLER: Received query params:', findFilterDto);

        return this.usersService.findAll(findFilterDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
