import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service'; // 서비스 호출
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/security/auth.service';

@Controller('user') // 기본 경로 설정
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const is_valid = await this.userService.login(body);
    const access_token = await this.authService.createAccessToken(is_valid)

    return access_token
  }

  @Get('logout')
  async logout() {
    return this.userService.logout();
  }

  @Get('attendance/list')
  async checkAttendance() {
    return this.userService.checkAttendance();
  }

  @Post('attendance')
  async saveParticipation() {
    return this.userService.saveParticipation();
  }

  @Get('setting/info')
  async checkMyInfo() {
    return this.userService.checkMyInfo();
  }

  @Get('event/list')
  async checkEventList() {
    return this.userService.checkEventList();
  }

  @Delete()
  async deleteUser() {
    return this.userService.deleteUser();
  }
}
