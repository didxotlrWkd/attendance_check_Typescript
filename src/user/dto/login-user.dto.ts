import { PickType } from "@nestjs/mapped-types";
import { Users } from "src/modules/users/entities/Users";




export class LoginUserDto extends PickType(Users, ['name','major', 'student_code', 'password'] as const){

}