import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly confingService: ConfigService
    ) { }

    async createAccessToken(user_id: number): Promise<{ access_token: string }> {
        try {
            const payload = {
                type: 'access_token',
                user_id
            }
            return {
                access_token: await this.jwtService.signAsync(
                    payload,
                    {
                        secret: this.confingService.get<string>("ACCESS_TOKEN_SECRET"),
                        expiresIn: "15m"
                    }
                )
            }
        }catch(err){
            throw err
        }
    }
}