import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsPhoneNumber('UA')
    phoneNumber: string;
}