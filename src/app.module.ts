import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { MyloggerModule } from './log/MyLogger.module';
import { SharedMoudle } from './shared/shared.moudle';
import { BffLoggerService } from './shared/bff-logger/BffLoggerService';

@Module({
  imports: [CatsModule, MyloggerModule, SharedMoudle],
  controllers: [AppController],
  providers: [AppService, BffLoggerService],
})
export class AppModule {}
