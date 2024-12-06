import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SecurityModule } from 'src/security/security.module';
import { JWTRepositoryModule } from 'src/modules/jwt/repositories/jwt.repository.module';
import { UserRepositoryModule } from 'src/modules/user/repositories/user.repository.module';
import { EventRepositoryModule } from 'src/modules/event/repositories/event.repository.module';

@Module({
  imports: [
    SecurityModule,
    JWTRepositoryModule,
    UserRepositoryModule,
    EventRepositoryModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
