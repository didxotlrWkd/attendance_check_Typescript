import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { CrpytService } from 'src/security/crypt.service';
import { editUserDto } from './dto/edit-user.dto';
import { PasswordService } from 'src/security/password.service';
import { DrawnUserRepository } from 'src/modules/event/repositories/drawnUser.repository';
import { EventRepository } from 'src/modules/event/repositories/event.repository';
import { editEventDto } from './dto/edit-event.dto';
import { ExcelService } from 'src/util/exel.service';
import { UserResponseDto } from 'src/user/dto/response-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly drawnUserRepository: DrawnUserRepository,
    private readonly cryptService: CrpytService,
    private readonly passwordService: PasswordService,
    private readonly eventRepository: EventRepository,
    private readonly excelService: ExcelService
  ) { }

  async editUserPage(user_id: number) {
    const user = await this.userRepository.findUserById(user_id)
    const decrypt_user_info = this.cryptService.decryptUserDto(user)
    return {
      id: decrypt_user_info.id,
      major: decrypt_user_info.major,
      name: decrypt_user_info.name,
      student_code: decrypt_user_info.student_code
    }
  }

  async getLoginPageData(): Promise<{ template: string; data: any }> {
    const data = {
      title: 'Login Page',
      message: 'Please enter your credentials',
    };

    // 템플릿 이름과 데이터를 반환
    return { template: 'login.html', data };
  }

  async checkAllUserInfo(): Promise<UserResponseDto[]> {
    try {
      const encrypt_user_info = await this.userRepository.findAllUser()
      const decrypt_user_info = this.cryptService.decryptUserInfo(encrypt_user_info)
      return decrypt_user_info
    } catch (err) {
      throw err
    }
  }

  async editUser(body: editUserDto) {
    try {
      const { id, student_code, name, major } = body
      const encrypt_name = this.cryptService.encrypt(name)
      const encrypt_student_code = this.cryptService.encrypt(student_code)

      const user = await this.userRepository.findUserById(id)
      if (!user) {
        throw new Error("존재하지 않는 아이디입니다.")
      }
      const is_student_code = await this.userRepository.findUserByEncryptStudentCode(encrypt_student_code)
      if (is_student_code && encrypt_student_code !== user.student_code) {
        throw new Error("중복되는 학번입니다.")
      }

      await this.userRepository.updateUser({ id, student_code: encrypt_student_code, name: encrypt_name, major })

      const edit_user = await this.userRepository.findUserById(id)
      const decrypt_user_info = this.cryptService.decryptUserDto(edit_user)
      return [{
        student_code: decrypt_user_info.student_code,
        major: decrypt_user_info.major,
        name: decrypt_user_info.name,
        id: decrypt_user_info.id,
        participant_count: decrypt_user_info.participant_count
      }]

    } catch (err) {
      throw err
    }
  }


  async deleteUserByAdmin(user_id: number) {
    try {
      await this.userRepository.deleteUser(user_id)
    } catch (err) {
      throw err
    }
  }

  async editUserPassword(password: string, user_id: number) {
    try {
      const bcrypt_password = await this.passwordService.hashPassword(password)
      await this.userRepository.updatePassword(user_id, bcrypt_password)
    } catch (err) {
      throw err
    }
  }

  async drawRandomParticipant(body: any): Promise<any> {
    const { number_of_draw, participant_count } = body;
    const encrypt_drawn_user = await this.userRepository.drawnRandomUserSelectedNumber(number_of_draw, participant_count)
    const decrypt_user_info = this.cryptService.decryptUserInfo(encrypt_drawn_user)
    return decrypt_user_info
  }

  async drawRandomUserResultPageForProjector(draw_count: number) {
    const animations = [
      "animate__animated animate__fadeIn",
      "animate__animated animate__bounce",
      "animate__animated animate__zoomIn",
      "animate__animated animate__lightSpeedInLeft",
      "animate__animated animate__backInDown",
      "animate__animated animate__backInUp",
      "animate__animated animate__bounceInDown",
      "animate__animated animate__fadeInDown"
    ];
    try {
      const drawn_user = await this.drawnUserRepository.checkDrawnUser()
      console.log(drawn_user)
      const encrypt_drawn_user = await this.userRepository.drawnRandomUserParticipant5(drawn_user)
      if (encrypt_drawn_user) {
        await this.drawnUserRepository.addDrawnUser(encrypt_drawn_user.id);
        const randomIndex = Math.floor(Math.random() * animations.length);
        const selectedAnimation = animations[randomIndex];

        const decrypt_drawn_user = this.cryptService.decryptUserDto(encrypt_drawn_user)

        return {
          users: [decrypt_drawn_user],
          animation_class: selectedAnimation,
          draw_count: draw_count + 1
        }
      } else {
        return {
          users: null,
          animation_class: "table",
          message: "추첨 가능 인원이 없습니다."
        }
      }
    } catch (err) {
      throw err
    }
  }

  async searchSpecificUser(student_code: string): Promise<UserResponseDto[]> {
    try {
      const encrypt_student_code = this.cryptService.encrypt(student_code)
      const user = await this.userRepository.findUserByEncryptStudentCode(encrypt_student_code)

      if (!user) {
        return null
      }
      const decrypt_user_info = this.cryptService.decryptUserDto(user)

      return [decrypt_user_info]
    } catch (err) {
      throw err
    }
  }

  async searchEvents() {
    try {
      const events = await this.eventRepository.getAllEvents();
      return { events }
    } catch (err) {
      throw err
    }
  }

  async editEventPage(event_code: string) {
    try {
      const event = await this.eventRepository.getEventInfo(event_code)

      return { event }
    } catch (err) {
      throw err
    }
  }

  async editEvent(body: editEventDto) {
    try {
      await this.eventRepository.editEvent(body)

      const events = await this.eventRepository.getAllEvents()

      return { events }
    } catch (err) {
      throw err
    }
  }

  async searchUserById(user_id: number): Promise<UserResponseDto[]> {
    try {
      const user = await this.userRepository.findUserById(user_id)
      return [user]
    } catch (err) {
      throw err
    }
  }

  async addEvent(body: editEventDto) {
    try {
      const is_event_code = await this.eventRepository.validEventCode(body.event_code)
      if (is_event_code) {
        return {
          error: '중복된 행사 코드입니다',
          events: await this.eventRepository.getAllEvents()
        }
      }

      await this.eventRepository.addEvent(body)
      
    } catch (err) {
      throw err
    }
  }

  async downloadExcel(): Promise<any> {
    try{
      const students = await this.userRepository.checkUserInfoByParticipantCount()
      const excelPath = await this.excelService.createExcelFile(students)

      return excelPath
    }catch(err){
      throw err
    }
  }

  async adminLogin(body) {
 
  }

  // async logout(): Promise<any> {
  //     // 로그아웃 로직
  //     return { message: '로그아웃 성공' };
  // }
}
