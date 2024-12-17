import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TransformResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse();

      console.log('interceptor on')
  
      return next.handle().pipe(
        map((data) => {
          return {
            success: true,
            statusCode: response.statusCode,
            data,
          };
        }),
      );
    }
  }
  