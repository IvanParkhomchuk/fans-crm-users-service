import {Injectable, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import {UsersRepository} from "../../users/users.repository";
import {TokenPayload} from "../interfaces/token-payload.interface";
import {UserDocument} from "../../users/models/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET')!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: TokenPayload): Promise<UserDocument> {
        const { userId } = payload;
        const user = await this.usersRepository.findOne({ _id: userId });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}