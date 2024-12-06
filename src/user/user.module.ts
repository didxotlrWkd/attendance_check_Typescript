import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { RepositoriesModule } from 'src/modules/users/repositories/repositories.module';
import { SecuritiesModule } from 'src/security/security.module';

@Module({
  imports: [SecuritiesModule,RepositoriesModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
