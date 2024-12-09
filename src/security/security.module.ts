import { Module } from '@nestjs/common';
import { CrpytService } from './crypt.service';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTRepositoryModule } from 'src/modules/jwt/repositories/jwt.repository.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminLocalAuthGuard } from './admin.auth.guard';
import { AdminAuthService } from './admin.auth.service';
import { AdminNotLoggedInGuard } from './admin.not-logged-in.guard';
import { LocalStrategy } from './local.stratey';
import { LocalSerializer } from './local.serializer';
import { RedirectException } from './redirect-exception';
import { AdminLoggedInGuard } from './admin.logged-in.guard';


@Module({
    imports : [
        JwtModule.register({
            global: true,
        }),
        JWTRepositoryModule
    ],
    exports : [CrpytService, PasswordService, AuthService,AuthGuard,AdminLocalAuthGuard, AdminAuthService,AdminLoggedInGuard ,AdminNotLoggedInGuard,LocalStrategy,LocalSerializer,RedirectException],
    providers : [CrpytService, PasswordService, AuthService,AuthGuard,AdminLocalAuthGuard, AdminAuthService,AdminLoggedInGuard, AdminNotLoggedInGuard,LocalStrategy,LocalSerializer,RedirectException]
})
export class SecurityModule {}
