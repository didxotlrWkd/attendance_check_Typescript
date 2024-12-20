import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class editUserDto {

    @ApiProperty({
        description: "유저 아이디",
        example: "1"
    })
    @IsNumber()
    id : number;

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
}
