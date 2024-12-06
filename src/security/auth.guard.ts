import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly confingService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.confingService.get<string>('ACCESS_TOKEN_SECRET')
                }
            );
            request['decoded'] = payload;
        } catch (error) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return true; 
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return undefined;
        }
        const [type, token] = authHeader.split(' ');

        if (type === 'Bearer' && token) {
            return token;
        }

        return undefined;
    }
}
