import { ForbiddenException, HttpException, HttpStatus, Injectable, Next } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { CrpytService } from 'src/security/crypt.service';
import { PasswordService } from 'src/security/password.service';
import { UserPayload } from 'src/security/payload.interface';
import { RefreshTokenRepository } from 'src/modules/jwt/repositories/refreshtoken.repository';
import { RefreshTokenBlackListRepository } from 'src/modules/jwt/repositories/refreshtokenBlackList.repository';
import { ParticipantRepository } from 'src/modules/event/repositories/participant.repository';
import { EventRepository } from 'src/modules/event/repositories/event.repository';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response-user.dto';
import { EventListResponseDto } from './dto/response-event.dto';



@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly refreshTokenBlackListRepository: RefreshTokenBlackListRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly eventRepository: EventRepository,
    private readonly cryptService: CrpytService,
    private readonly passwordService: PasswordService,
  ) { }

  async login(body: LoginUserDto): Promise<number> {

    try {
      const encryptbody = this.cryptService.encryptUserDto(body)
      const is_user = await this.userRepository.findUserByEncryptStudentCode(encryptbody.student_code)
      if (is_user) {
        if (is_user.name !== encryptbody.name || is_user.major !== encryptbody.major) {
          throw ({message : '학생정보가 일치하지 않습니다', status_code : HttpStatus.UNAUTHORIZED})
        }

        const is_password_valid = await this.passwordService.verifyPassword(encryptbody.password, is_user.password)
        if (is_password_valid) {
          return is_user.id
        } else {
          throw new HttpException("패스워드가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED)
        }
      };
      const new_user = await this.userRepository.createUser({
        ...encryptbody,
        password: await this.passwordService.hashPassword(encryptbody.password)
      })
      return new_user.id
    } catch (err) {
      throw new HttpException(err.message || "internal server error", err.status_code || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async logout(decoded: UserPayload) {
    try {
      const { user_id } = decoded
      const refresh_token = await this.refreshTokenRepository.findRefreshToken(user_id)
      await this.refreshTokenBlackListRepository.saveRefreshTokenInBlackList(refresh_token)
      await this.refreshTokenRepository.deleteRefreshToken(refresh_token, user_id)
    } catch (err) {
      throw new HttpException(err.message || "internal server error", err.status_code || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async checkEventList(decoded: UserPayload) : Promise<EventListResponseDto> {
    try {
      const { user_id } = decoded
      const attendance_list = await this.eventRepository.getEventListWithAttendance(user_id)
      const events = attendance_list.map(event => {
        return {
          ...event,
          participants : event.participants.length > 0 ? true : false
        }
      })

      return  {events}
    } catch (err) {
      throw new HttpException(err.message || "internal server error", err.status_code || HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async saveParticipation(decoded: UserPayload, event_code: string) {
    try {
      const { user_id } = decoded
      const is_evnet_code = await this.eventRepository.validEventCode(event_code)
      if (!is_evnet_code) {
        throw ({ status_code: 451, message: "유효하지 않은 이벤트 코드입니다." })
      }
      const is_duplicated_event_code = await this.participantRepository.checkParticipant(event_code, user_id)
      if (is_duplicated_event_code) {
        throw ({ status_code: 452, message: "중복된 이벤트 코드입니다" })
      }
      await this.participantRepository.createParticipant(event_code, user_id)
      
    } catch (err) {
      throw new HttpException(err.message || "internal server error", err.status_code || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async checkMyInfo(decoded: UserPayload) : Promise<UserResponseDto>{
    try {
      const { user_id } = decoded
      const user = await this.userRepository.findUserById(user_id)
      const decrypt_user_info = this.cryptService.decryptUserDto(user)
      const plain_user = plainToInstance(UserResponseDto, decrypt_user_info)
      return plain_user
    } catch (err) {
      throw new HttpException(err.message || "internal server error", err.status_code || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteUser(decoded: UserPayload) {
    try {
      const { user_id } = decoded
      const refresh_token = await this.refreshTokenRepository.findRefreshToken(user_id)
      if(!refresh_token){
        throw new Error
      }
      await this.refreshTokenBlackListRepository.saveRefreshTokenInBlackList(refresh_token)
      await this.refreshTokenRepository.deleteRefreshToken(refresh_token, user_id)
      await this.userRepository.deleteUser(user_id)

      return
    } catch (err) {
      throw new HttpException(err.message || "internal server error", err.status_code || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
