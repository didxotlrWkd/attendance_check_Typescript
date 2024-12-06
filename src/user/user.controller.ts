import { Controller, Post, Get, Delete, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service'; // 서비스 호출
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/security/auth.service';
import { AuthGuard } from 'src/security/auth.guard';
import { Decoded } from 'src/security/auth.decorator';
import { UserPayload } from 'src/security/payload.interface';

@Controller('user') // 기본 경로 설정
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const is_valid = await this.userService.login(body);
    const access_token = await this.authService.createAccessToken(is_valid)
    const refresh_token = await this.authService.createRefreshToken(is_valid)  
    await this.authService.saveRefreshToken(refresh_token, is_valid)  

    return {access_token, refresh_token}
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Decoded() decoded : UserPayload ) {
    return this.userService.logout(decoded);
  }

  @UseGuards(AuthGuard)
  @Post('attendance/list')
  async checkAttendance(@Decoded() decoded : UserPayload) {
    return this.userService.checkAttendance(decoded);
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
