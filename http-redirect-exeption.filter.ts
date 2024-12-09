import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { RedirectException } from 'src/security/redirect-exception';

@Catch(RedirectException)
export class RedirectFilter implements ExceptionFilter {
  catch(exception: RedirectException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(exception.getResponse() as string);
  }
}
