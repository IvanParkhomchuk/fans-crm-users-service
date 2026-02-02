import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { UserDocument } from "../users/models/user.schema";
import { TokenPayload } from "./interfaces/token-payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login(user: UserDocument) {
        const tokenPayload: TokenPayload = {
            userId: user._id.toHexString(),
        };

        const expires = new Date();

        expires.setSeconds(
            expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
        );

        const accessToken = this.jwtService.sign(tokenPayload);

        return { accessToken };
    }
}
