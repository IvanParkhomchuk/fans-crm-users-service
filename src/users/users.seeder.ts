import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { faker } from '@faker-js/faker';
import { UserDocument } from './models/user.schema';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeeder implements Seeder {
    constructor(
        @InjectModel(UserDocument.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async seed(): Promise<any> {
        const TOTAL = 2_000_000;
        const BATCH_SIZE = 10_000;
        const batches = Math.ceil(TOTAL / BATCH_SIZE);

        const hashedPassword = await bcrypt.hash('Password123!', 10);

        for (let i = 0; i < batches; i++) {
            const currentBatchSize = Math.min(BATCH_SIZE, TOTAL - i * BATCH_SIZE);

            const users = Array.from({ length: currentBatchSize }, (_, index) => ({
                name: faker.person.fullName(),
                email: `user_${i * BATCH_SIZE + index}@example.com`,
                password: hashedPassword,
                phoneNumber: faker.phone.number(),
            }));

            await this.userModel.insertMany(users, { ordered: false });
        }
    }

    async drop(): Promise<any> {
        return this.userModel.deleteMany({});
    }
}