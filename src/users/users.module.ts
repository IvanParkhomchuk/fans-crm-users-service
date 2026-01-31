import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {UsersRepository} from "./users.repository";
import {UserDocument, UserSchema} from "./models/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController]
})
export class UsersModule {}
