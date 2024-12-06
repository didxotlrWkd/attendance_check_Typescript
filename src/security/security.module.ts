import { Module } from '@nestjs/common';
import { CrpytService } from './crypt.service';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';


@Module({
    imports : [
        JwtModule.register({
            global: true,
        })
    ],
    exports : [CrpytService, PasswordService, AuthService],
    providers : [CrpytService, PasswordService, AuthService]
})
export class SecuritiesModule {}
