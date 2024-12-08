import { Controller, Post, Get, Delete, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service'; // 서비스 호출
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/security/auth.service';
import { AuthGuard } from 'src/security/auth.guard';
import { Decoded } from 'src/security/auth.decorator';
import { UserPayload } from 'src/security/payload.interface';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('user') // 기본 경로 설정
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: "로그인" })
  @ApiResponse({
    status: 200,
    description: '로그인 성공시 액세스 및 리프레시 토큰 반환',
    schema: {
      example: {
        access_token: "your_access_token",
        refresh_token: "your_refresh_token"
      }
    }
  })
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const is_valid = await this.userService.login(body);
    const access_token = await this.authService.createAccessToken(is_valid)
    const refresh_token = await this.authService.createRefreshToken(is_valid)
    await this.authService.saveRefreshToken(refresh_token, is_valid)

    return { access_token, refresh_token }
  }

  @ApiOperation({summary : "로그아웃"})
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Decoded() decoded: UserPayload) {
    return await this.userService.logout(decoded);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: '이벤트 목록 및 참여 내역',
    schema: {
      type: 'array',
      items: {
          type: 'object',
          properties: {
              event_code: { type: 'string', example: 'hdhdfhd' },
              event_name: { type: 'string', example: 'hdhdfh' },
              description: { type: 'string', example: 'dhdfh' },
              location: { type: 'string', example: 'dfhdfhdfh' },
              event_start_time: { type: 'string', format: 'date-time', example: '2024-10-15T08:50:00.000Z' },
              event_end_time: { type: 'string', format: 'date-time', example: '2024-10-15T08:53:00.000Z' },
              participants: {
                  type: 'array',
                  items: {
                      type: 'object',
                      properties: {
                          user_id: { type: 'number', example: 5 }
                      }
                  }
              }
          }
      }
  }
  })
  @Get('event/list')
  async checkAttendance(@Decoded() decoded: UserPayload) {
    return await this.userService.checkEventList(decoded);
  }

  @UseGuards(AuthGuard)
  @Post('attendance')
  @ApiOperation({ summary: '참여 저장' })
    @ApiBody({
        description: '이벤트 참여 정보',
        schema: {
            properties: {
                event_code: {
                    type: 'string',
                    example: 'event123',
                },
            },
        },
  })
  async saveParticipation(@Body('event_code') event_code: string, @Decoded() decoded: UserPayload) {
    return await this.userService.saveParticipation(decoded, event_code);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: '유저 설정 정보 반환',
    schema: {
      example: {
        student_code: "20191535",
        name: "양태식",
        major: "사물인터넷학과"
      }
    }
  })
  @Get('setting/info')
  async checkMyInfo(@Decoded() decoded: UserPayload){
    return await this.userService.checkMyInfo(decoded);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Decoded() decoded: UserPayload){
    return await this.userService.deleteUser(decoded);
  }
}
