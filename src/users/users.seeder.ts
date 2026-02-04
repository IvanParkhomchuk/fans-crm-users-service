import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { UserDocument } from './models/user.schema';
import bcrypt from 'bcryptjs';
import {DEFAULT_ADMIN, DEFAULT_USER_PASSWORD} from './constants/default-users.constant';
import {UserGenerator} from "./helpers/user-generator.helper";
import {SEED_CONFIG} from "./constants/seed-config.constant";

@Injectable()
export class UsersSeeder implements Seeder {
    constructor(
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async seed(): Promise<any> {
        await this.createDefaultAdmin();
        await this.generateRandomUsers();
    }

    private async createDefaultAdmin(): Promise<void> {
        const existingAdmin = await this.userModel.findOne({
            email: DEFAULT_ADMIN.email
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
            const admin = UserGenerator.generateAdminUser(hashedPassword, DEFAULT_ADMIN);

            await this.userModel.create(admin);
        } else {
            console.log('Default Admin already exist');
        }
    }

    private async generateRandomUsers(): Promise<void> {
        const { totalUsers, batchSize } = SEED_CONFIG;
        const batches = Math.ceil(totalUsers / batchSize);
        const hashedPassword = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);

        for (let i = 0; i < batches; i++) {
            const currentBatchSize = Math.min(batchSize, totalUsers - i * batchSize);

            const users = Array.from({ length: currentBatchSize }, (_, index) => {
                const globalIndex = i * batchSize + index;
                return UserGenerator.generateRandomUser(globalIndex, hashedPassword);
            });

            await this.userModel.insertMany(users, { ordered: false });
        }
    }

    async drop(): Promise<any> {
        return this.userModel.deleteMany({});
    }
}