import { Controller, Post, Get, Delete, Body, UseGuards, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service'; 
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/security/auth.service';
import { AuthGuard } from 'src/security/auth.guard';
import { Decoded } from 'src/security/auth.decorator';
import { UserPayload } from 'src/security/payload.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtResponseDto } from './dto/response-jwt.dto';
import { EventListResponseDto } from './dto/response-event.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { ResponseEntity } from './dto/response-entity.dto';

@Controller('user') 
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: "로그인" })
  @ApiResponse({
    status: 200,
    description: '로그인 성공, 액세스 토큰과 리프레시 토큰 반환',
    type : JwtResponseDto
  })
  @Post('login')
  async login(
    @Body() body: LoginUserDto
  ) : Promise<ResponseEntity<JwtResponseDto>> {
    const is_valid = await this.userService.login(body);
    const access_token = await this.authService.createAccessToken(is_valid)
    const refresh_token = await this.authService.createRefreshToken(is_valid)
    await this.authService.saveRefreshToken(refresh_token, is_valid)

    return ResponseEntity.ok_with(HttpStatus.CREATED,{access_token, refresh_token})
  }


  @ApiBearerAuth()
  @ApiOperation({summary : "로그아웃"})
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @Decoded() decoded: UserPayload
  ) : Promise<ResponseEntity<undefined>>{
    await this.userService.logout(decoded);
    return ResponseEntity.ok(HttpStatus.NO_CONTENT)
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: '이벤트 목록 확인' })
  @ApiResponse({
    status: 200,
    description: '이벤트 목록 및 참여 내역',
    type : EventListResponseDto
  })
  @UseGuards(AuthGuard)
  @Get('event/list')
  async checkAttendance(
    @Decoded() decoded: UserPayload
  ) : Promise<ResponseEntity<EventListResponseDto>> {
    const event_list =  await this.userService.checkEventList(decoded);
    return ResponseEntity.ok_with(HttpStatus.OK , event_list)
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: '참여 저장' })
  @ApiBody({
        description: '이벤트 참여 정보',
        schema: {
            properties: {
                event_code: {
                    type: 'string',
                    example: 'SCHUSWCU1stAF_OpeningCeremony',
                },
            },
        },
  })
  @UseGuards(AuthGuard)
  @Post('attendance')
  async saveParticipation(
    @Body('event_code') event_code: string,
    @Decoded() decoded: UserPayload
  ) : Promise<ResponseEntity<undefined>>{
   await this.userService.saveParticipation(decoded, event_code);
   return ResponseEntity.ok(HttpStatus.CREATED)
  }

  
  @ApiBearerAuth()
  @ApiOperation({ summary: '학생 정보 확인' })
  @ApiResponse({
    status: 200,
    description: '학생 설정 정보 반환',
    type : UserResponseDto
  })
  @UseGuards(AuthGuard)
  @Get('setting/info')
  async checkMyInfo(
    @Decoded() decoded: UserPayload
  ) : Promise<ResponseEntity<UserResponseDto>> {
    const myInfo =  await this.userService.checkMyInfo(decoded);
    return ResponseEntity.ok_with(HttpStatus.OK, myInfo)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '학생 정보 삭제' })
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(
    @Decoded() decoded: UserPayload
  ): Promise<ResponseEntity<undefined>>{
    await this.userService.deleteUser(decoded);
    return ResponseEntity.ok(HttpStatus.NO_CONTENT)
  }
}
