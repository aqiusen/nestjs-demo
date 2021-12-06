import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { MyloggerModule } from './log/MyLogger.module';
import { SharedMoudle } from './shared/shared.moudle';
import { BffLoggerService } from './shared/bff-logger/BffLoggerService';
import { RoleGuardModule } from './role-guard/role-guard.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';
@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    CatsModule,
    MyloggerModule,
    SharedMoudle,
    RoleGuardModule,
    EmailModule,
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('email'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, BffLoggerService],
})
export class AppModule {}
