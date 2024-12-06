import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refreshtoken } from '../entities/Refreshtoken';
import { RefreshTokenRepository } from './refreshtoken.repository';
import { Refreshtokenblacklist } from '../entities/Refreshtokenblacklist';
import { RefreshTokenBlackListRepository } from './refreshtokenBlackList.repository';
import { Accesstoken } from '../entities/Accesstoken';


@Module({
    imports : [TypeOrmModule.forFeature([
        Refreshtoken,
        Refreshtokenblacklist,
        Accesstoken,
      ]),
    ],
    providers: [RefreshTokenRepository,RefreshTokenBlackListRepository],
    exports : [RefreshTokenRepository,RefreshTokenBlackListRepository],
})
export class JWTRepositoryModule {}
