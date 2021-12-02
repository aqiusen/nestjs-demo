import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/error.filter';
import { LoggingInterceptor } from './interceptor/LoggingInterceptor';
import MyLoggerService from './log/MyLogger.service';
import { doIt } from './ts-demo';

// 函数式中间件
const testMiddleWare = (res: any, req: any, next) => {
  console.log('进入中间件');
  next();
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  //中间件的触发是在请求发送出去之后才会进入的，初始化的时候不会进入
  app.use(testMiddleWare); //先经过全局中间件，然后经过AppModule中模块的中间件
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useLogger(app.get(MyLoggerService));
  await app.listen(3333);
}
// doIt();
bootstrap();
