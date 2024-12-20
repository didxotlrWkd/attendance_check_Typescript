import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class UserResponseDto {

    @ApiProperty({
        description: "학번",
        example: "20191234"
    })
    @Expose()
    @IsString()
    student_code: string;

    @ApiProperty({
        description: "학과",
        example: "사물인터넷학과"
    })
    @Expose()
    @IsString()
    major: string;

    @ApiProperty({
        description: "이름",
        example: "양태식"
    })
    @Expose()
    @IsString()
    name: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}

