import { HttpException, HttpStatus, Injectable, Next } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';

import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { CrpytService } from 'src/security/crypt.service';
import { PasswordService } from 'src/security/password.service';
import { UserPayload } from 'src/security/payload.interface';
import { AuthService } from 'src/security/auth.service';
import { RefreshTokenRepository } from 'src/modules/jwt/repositories/refreshtoken.repository';
import { RefreshTokenBlackListRepository } from 'src/modules/jwt/repositories/refreshtokenBlackList.repository';
import { ParticipantRepository } from 'src/modules/event/repositories/participant.repository';


@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly refreshTokenBlackListRepository: RefreshTokenBlackListRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly configService: ConfigService,
    private readonly cryptService: CrpytService,
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService
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

  async logout(decoded : UserPayload) {
    try{
      const {user_id} = decoded
      const refresh_token = await this.refreshTokenRepository.findRefreshToken(user_id)
      await this.refreshTokenBlackListRepository.saveRefreshToken(refresh_token, user_id)
      await this.refreshTokenRepository.deleteRefreshToken(refresh_token, user_id)
    }catch(err){
      throw err
    }
  }

  async checkAttendance(decoded: UserPayload) {
    try{
      console.log(decoded)
      const {user_id} = decoded
      const attendance_list = await this.participantRepository.searchParticipantList(user_id)
      return attendance_list
    }catch(err){
      throw err
    }

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
