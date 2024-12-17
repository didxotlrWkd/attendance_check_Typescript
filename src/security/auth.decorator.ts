import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './payload.interface';

export const Decoded = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) : UserPayload=> {
        const request = ctx.switchToHttp().getRequest();
        return request.decoded; 
    },
);