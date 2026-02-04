import {IsInt, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class FindFilterDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    perPage?: number = 10;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}