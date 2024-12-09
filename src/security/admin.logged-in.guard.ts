import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedirectException } from './redirect-exception';

@Injectable()
export class AdminLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.session?.passport?.user) {
      
      throw new RedirectException('/admin/login')
    }

    return request.isAuthenticated();
  }
}
