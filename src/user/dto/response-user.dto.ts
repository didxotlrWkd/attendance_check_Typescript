import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseUserDto {

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
}

