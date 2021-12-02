import { Global, Module } from '@nestjs/common';
import MyLoggerService from './MyLogger.service';
@Global()
@Module({
  exports: [MyLoggerService],
  providers: [MyLoggerService],
})
export class MyloggerModule {}
