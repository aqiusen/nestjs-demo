import { Global, LoggerService } from '@nestjs/common';

export default class MyLoggerService implements LoggerService {
  log(message: any, context?: string) {
    console.log(message + ':' + context);
  }
  error(message: any, trace?: string, context?: string) {
    throw new Error('Method not implemented.');
  }
  warn(message: any, context?: string) {
    throw new Error('Method not implemented.');
  }
  debug?(message: any, context?: string) {
    throw new Error('Method not implemented.');
  }
  verbose?(message: any, context?: string) {
    throw new Error('Method not implemented.');
  }
  static log(message: any, context?: string) {
    console.log(message + ':' + context);
  }
}
