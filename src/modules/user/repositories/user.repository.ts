import { Injectable } from "@nestjs/common";
import { User } from "../entities/User";
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { editUserDto } from "src/admin/dto/edit-user.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async drawnRandomUserSelectedNumber(number_of_draw: number, participant_count: number) {
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .where('user.participant_count >= :participant_count', { participant_count })
                .orderBy('RAND()')
                .take(number_of_draw)
                .getMany();

            return users
        } catch (err) {
            throw err
        }
    }

    async drawnRandomUserParticipant5(drawn_ids: number[]) {
        try {

            if(drawn_ids.length == 0){
                const users = await this.userRepository
                .createQueryBuilder('user')
                .where('user.participant_count >= :participant_count', { participant_count: 5 })
                .orderBy('RAND()')
                .getOne();

                return users
            }else{
                const users = await this.userRepository
                .createQueryBuilder('user')
                .where('user.participant_count >= :participant_count', { participant_count: 5 })
                .andWhere('user.id NOT IN (:...drawn_ids)', { drawn_ids })
                .orderBy('RAND()')
                .getOne();
                return users
            }
        } catch (err) {
            throw err
        }
    }

    async updateUser(user: editUserDto) {
        try {
            await this.userRepository.update(
                { id: user.id },
                {
                    student_code: user.student_code,
                    major: user.major,
                    name: user.name,
                }
            )
        } catch (err) {
            throw err
        }
    }

    async updatePassword(user_id: number, password: string) {
        try {
            await this.userRepository.update(
                { id: user_id },
                {
                    password
                }
            )
        } catch (err) {
            throw err
        }
    }

    async findAllUser(): Promise<User[]> {
        try {
            const encrypt_user_info = await this.userRepository.find({
                select: ['name', 'student_code', 'participant_count', 'major', 'id'],
            });
            return encrypt_user_info
        } catch (err) {
            throw err
        }
    }

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

    async findUserById(user_id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: user_id
                }
            })
            return user
        } catch (err) {
            throw err
        }
    }

    async deleteUser(user_id: number) {
        try {
            const result = await this.userRepository.softDelete(user_id); // user_id를 직접 전달

            if (result.affected === 0) {
                throw new Error("유저가 존재하지 않습니다."); // 삭제된 유저가 없을 경우 예외 처리
            }

            return { message: "유저가 성공적으로 삭제되었습니다." }; // 성공 메시지 반환
        } catch (err) {
            throw err
        }
    }

    async checkUserInfoByParticipantCount() {
        try {
            const users = await this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.participants', 'participant')
                .leftJoinAndSelect('participant.event', 'event')
                .select([
                    'user.name',
                    'user.major',
                    'user.student_code',
                    'user.participant_count',
                    'participant.event_code',
                    'event.event_name',
                ])
                .orderBy('user.participant_count', 'DESC')
                .getMany();

            return users;
        } catch (err) {
            throw err;
        }
    }
}