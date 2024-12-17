import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class UserResponseDto {

    @ApiProperty({
        description: "학번"
    })
    @Expose()
    @IsString()
    student_code: string;

    @ApiProperty({
        description: "학과"
    })
    @Expose()
    @IsString()
    major: string;

    @ApiProperty({
        description: "이름"
    })
    @Expose()
    @IsString()
    name: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
      }
}

