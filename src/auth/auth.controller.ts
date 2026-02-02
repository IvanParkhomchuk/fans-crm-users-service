import {Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserDocument } from "../users/models/user.schema";
import { CurrentUser } from "./decorators/current-user.decorator";
import {LocalAuthGuard} from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @CurrentUser() user: UserDocument,
    ) {
        return this.authService.login(user);
    }
}
