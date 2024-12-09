import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthService } from './admin.auth.service';
import { RedirectException } from './redirect-exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private adminAuthService: AdminAuthService) {
    super({ usernameField: 'id', passwordField: 'password' });
  }

  async validate(id: string, password: string, done: CallableFunction) {
    const user = await this.adminAuthService.validateUser(id, password);
    if (!user) {
      throw new RedirectException('/admin/login');
    }
    return done(null, user);
  }
}
