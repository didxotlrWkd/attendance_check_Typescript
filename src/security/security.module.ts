import { Module } from '@nestjs/common';
import { CrpytService } from './crypt.service';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTRepositoryModule } from 'src/modules/jwt/repositories/jwt.repository.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@Module({
    imports : [
        JwtModule.register({
            global: true,
        }),
        JWTRepositoryModule
    ],
    exports : [CrpytService, PasswordService, AuthService,AuthGuard],
    providers : [CrpytService, PasswordService, AuthService,AuthGuard]
})
export class SecurityModule {}
