import {seeder} from "nestjs-seeder";
import {MongooseModule} from "@nestjs/mongoose";
import {UserDocument, UserSchema} from "./users/models/user.schema";
import {UsersSeeder} from "./users/users.seeder";

seeder({
    imports: [
        MongooseModule.forRoot("mongodb://localhost:27017/fans_crm_users"),
        MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    ],
}).run([UsersSeeder]);