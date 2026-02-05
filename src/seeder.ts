import {seeder} from "nestjs-seeder";
import {MongooseModule} from "@nestjs/mongoose";
import {UserDocument, UserSchema} from "./users/models/user.schema";
import {UsersSeeder} from "./users/users.seeder";
import {ConfigModule, ConfigService} from "@nestjs/config";

seeder({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_LOCAL_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    ],
}).run([UsersSeeder]);