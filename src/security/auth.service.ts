import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenRepository } from "src/modules/jwt/repositories/refreshtoken.repository";


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly confingService: ConfigService,
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) { }

    async createAccessToken(user_id: number): Promise<string> {
        try {
            const payload = {
                type: 'access_token',
                user_id
            }
            return await this.jwtService.signAsync(
                payload,
                {
                    secret: this.confingService.get<string>("ACCESS_TOKEN_SECRET"),
                    expiresIn: "15d"
                }
            )

        } catch (err) {
            throw err
        }
    }

    async createRefreshToken(user_id: number): Promise<string> {
        try {
            const payload = {
                type: 'refresh_token',
                user_id
            }
            return await this.jwtService.signAsync(
                payload,
                {
                    secret: this.confingService.get<string>("ACCESS_TOKEN_SECRET"),
                    expiresIn: "15m"
                }
            )
        } catch (err) {
            throw err
        }
    }

    async saveRefreshToken(refresh_token: string, user_id: number) {
        try {
            await this.refreshTokenRepository.saveRefreshToken(refresh_token, user_id)
        } catch (err) {
            throw err
        }
    }
}