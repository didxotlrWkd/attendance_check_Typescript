import { ApiProperty } from "@nestjs/swagger";

export interface UserPayload {
    user_id: number;
    type : string;
    //추후 추가
}