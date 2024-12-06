import { Injectable } from "@nestjs/common";
import { Users } from "../entities/Users";
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm";
import { LoginUserDto } from "src/user/dto/login-user.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) { }

    async findUserByEncryptStudentCode(student_code: string): Promise<Users> {
        try {
            const user = await this.userRepository.findOne({ where: { student_code } });

            return user
        } catch (err) {
            throw err
        }
    }

    async createUser(encryptUserDto: LoginUserDto): Promise<Users> {
        try {
            const new_user = this.userRepository.create({
                major: encryptUserDto.major,
                name: encryptUserDto.name,
                student_code: encryptUserDto.student_code,
                password: encryptUserDto.password
            }
            )
            await this.userRepository.save(new_user);
            return new_user
        } catch (err) {
            throw err
        }
    }
}