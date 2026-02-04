import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "../users/models/user.schema";
import { TokenPayload } from "./interfaces/token-payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login(user: UserDocument): Promise<{ accessToken: string }> {
        const tokenPayload: TokenPayload = {
            userId: user._id.toHexString(),
        };

        const accessToken = this.jwtService.sign(tokenPayload);

        return { accessToken };
    }
}
