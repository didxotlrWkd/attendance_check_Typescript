import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class JwtResponseDto{
    @ApiProperty()
    @IsString()
    access_token : string

    @ApiProperty()
    @IsString()
    refresh_token : string
}