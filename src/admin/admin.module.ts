import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserRepositoryModule } from 'src/modules/user/repositories/user.repository.module';
import { SecurityModule } from 'src/security/security.module';
import { EventRepositoryModule } from 'src/modules/event/repositories/event.repository.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports : [
    UserRepositoryModule,
    SecurityModule,
    EventRepositoryModule,
    UtilModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  
}
