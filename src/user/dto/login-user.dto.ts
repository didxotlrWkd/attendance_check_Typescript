import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: "학번"
    })
    @IsString()
    student_code: string;

    @ApiProperty({
        description: "학과"
    })
    @IsString()
    major: string;

    @ApiProperty({
        description: "이름"
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "해시화된 비밀번호"
    })
    @IsString()
    password: string;

}

