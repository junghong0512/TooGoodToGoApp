import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [StoreController],
  providers: [
    StoreService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class StoreModule {}
