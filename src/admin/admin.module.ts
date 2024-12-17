import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserRepositoryModule } from 'src/modules/user/repositories/user.repository.module';
import { SecurityModule } from 'src/security/security.module';
import { EventRepositoryModule } from 'src/modules/event/repositories/event.repository.module';
import { UtilModule } from 'src/util/util.module';
import passport from 'passport';
import session from 'express-session';

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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'your-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false }, 
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes(AdminController); 
  }
}
