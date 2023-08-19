import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';

import { UserInterceptor } from './user/interceptors/user.interceptor';

@Module({
  imports: [UserModule, PrismaModule, StoreModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
