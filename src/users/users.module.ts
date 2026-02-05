import {forwardRef, Module, OnModuleInit} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersRepository } from "./users.repository";
import { UserDocument, UserSchema } from "./models/user.schema";
import { AuthModule } from "../auth/auth.module";
import {UsersSeeder} from "./users.seeder";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
