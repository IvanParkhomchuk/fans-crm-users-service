import {Types} from "mongoose";
import {faker} from "@faker-js/faker";
import {DEFAULT_ADMIN} from "../constants/default-users.constant";

export class UserGenerator {
    static generatePhoneNumber(): string {
        const areaCode = faker.string.numeric(3);
        const prefix = faker.string.numeric(3);
        const lineNumber = faker.string.numeric(4);
        return `+1 (${areaCode}) ${prefix}-${lineNumber}`;
    }

    static generateRandomUser(index: number, hashedPassword: string) {
        return {
            _id: new Types.ObjectId(),
            name: faker.person.fullName(),
            email: `user_${index}@gmail.com`,
            password: hashedPassword,
            phoneNumber: this.generatePhoneNumber(),
        };
    }

    static generateAdminUser(hashedPassword: string, adminData: typeof DEFAULT_ADMIN) {
        return {
            _id: new Types.ObjectId(),
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            phoneNumber: adminData.phoneNumber,
        };
    }
}