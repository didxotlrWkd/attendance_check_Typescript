import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsString } from 'class-validator';

export class editEventDto{
    
    @IsString()
    event_code : string

    @IsString()
    event_name : string

    @IsString()
    description : string

    @IsString()
    location : string

    @IsString()
    event_start_time : string

    @IsString()
    event_end_time : string
}
