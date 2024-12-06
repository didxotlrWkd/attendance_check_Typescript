import { HttpException, HttpStatus, Injectable, Next } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';

import { UserRepository } from 'src/modules/users/repositories/users.repository';
import { CrpytService } from 'src/security/crypt.service';
import { PasswordService } from 'src/security/password.service';


@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly cryptService: CrpytService,
    private readonly passwordService: PasswordService
  ) { }

  async login(body: LoginUserDto) : Promise<number> {

    try {

      const encryptbody = this.cryptService.encryptUserDto(body)
      const is_user = await this.userRepository.findUserByEncryptStudentCode(encryptbody.student_code)
      if (is_user) {
        if (is_user.name !== encryptbody.name || is_user.major !== encryptbody.major) {
          throw new HttpException('학생정보가 일치하지 않습니다', HttpStatus.UNAUTHORIZED)
        }

        const is_password_valid = await this.passwordService.verifyPassword(encryptbody.password, is_user.password)
        if(is_password_valid){
          return is_user.id
        }else{
          throw new HttpException("패스워드가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED)
        }
      };
      const new_user = await this.userRepository.createUser({
        ...encryptbody,
        password: await this.passwordService.hashPassword(encryptbody.password)
      })
      return new_user.id
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  logout() {
    return `This action returns all user`;
  }

  checkAttendance() {
    return;
  }

  saveParticipation() {
    return
  }

  checkMyInfo() {
    return
  }

  checkEventList() {
    return
  }

  deleteUser() {
    return
  }
}
