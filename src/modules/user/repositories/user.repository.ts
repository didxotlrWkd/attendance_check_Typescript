import { Injectable } from "@nestjs/common";
import { User } from "../entities/User";
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm";
import { LoginUserDto } from "src/user/dto/login-user.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findUserByEncryptStudentCode(student_code: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { student_code } });

            return user
        } catch (err) {
            throw err
        }
    }

    async createUser(encryptUserDto: LoginUserDto): Promise<User> {
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