import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LitteCatsModule } from './litte-cats/litte-cats.module';
import { MyloggerModule } from './log/MyLogger.module';

@Module({
  imports: [CatsModule, LitteCatsModule, MyloggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
