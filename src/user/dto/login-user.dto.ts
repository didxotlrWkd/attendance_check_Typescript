import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        description: "학번",
        example: "20191234"
    })
    @IsString()
    student_code: string;

    @ApiProperty({
        description: "학과",
        example: "사물인터넷학과"
    })
    @IsString()
    major: string;

    @ApiProperty({
        description: "이름",
        example: "dlfma"
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "해시화된 비밀번호",
        example: "qlalfqjsgh"
    })
    @IsString()
    password: string;

}

