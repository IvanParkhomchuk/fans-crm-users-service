import { Controller, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserDocument } from "../users/models/user.schema";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(
        @CurrentUser() user: UserDocument,
    ) {
        return this.authService.login(user);
    }
}
