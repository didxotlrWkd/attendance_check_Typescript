import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsString } from 'class-validator';

export class editUserDto{
    
    @IsString()
    id : number

    @IsString()
    student_code : string

    @IsString()
    major : string

    @IsString()
    name : string
}
