import {UserDocument} from "../models/user.schema";

export class PaginatedUsersDto {
    data: UserDocument[];
    meta: {
        total: number;
        page: number;
        perPage: number;
    };
}