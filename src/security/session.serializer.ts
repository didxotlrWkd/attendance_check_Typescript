import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  // 세션 저장 메서드
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.USER_ID);
  }
  
  // 세션에서 정보를 꺼내올 때 사용하는 메서드
  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
   // const user = await this.userService.findById(payload);
    // if (!user) {
    //   done(new Error('유저가 없습니다'), null);
    //   return;
    // }
    // const { USER_PW, ...userInfo } = user;
    //done(null, userInfo);
  }
}