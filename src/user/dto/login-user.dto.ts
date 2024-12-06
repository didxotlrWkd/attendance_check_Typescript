import { PickType } from "@nestjs/mapped-types";
import { User } from "src/modules/user/entities/User";




export class LoginUserDto extends PickType(User, ['name','major', 'student_code', 'password'] as const){

}