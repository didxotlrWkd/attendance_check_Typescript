import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
  ) {
    super();
  }

  serializeUser(user: boolean, done: CallableFunction) {
    done(null, user);
  }

  async deserializeUser(admin: boolean, done: CallableFunction) {
    try {
      done(null, admin);
    } catch (error) {
      done(error); 
    }
  }
}
