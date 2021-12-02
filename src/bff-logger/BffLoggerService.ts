import clc from 'cli-color';
import { isObject } from 'lodash';
import moment from 'moment';
import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { configure, getLogger } from 'log4js';

let logger;
if (process.env.isCFDC || process.env.NODE_ENV === 'development') {
  logger = {
    info: (v) => {
      process.stdout.write(v + '\n');
    },
  };
} else {
  configure({
    appenders: {
      filelogger: {
        type: 'file',
        filename: 'log/app-bff.log',
        maxLogSize: 700_000_000,
        backups: 5,
        compress: true,
        layout: { type: 'messagePassThrough' },
      },
    },
    categories: { default: { appenders: ['filelogger'], level: 'info' } },
  });
  logger = getLogger();
}

@Injectable()
export class BffLoggerService implements LoggerService {
  private static instance?: typeof BffLoggerService | LoggerService =
    BffLoggerService;

  constructor(
    @Inject(REQUEST) private request,
    @Optional() private readonly context?: string,
    @Optional() private readonly isTimestampEnabled = false,
  ) {}

  prefixLogger() {
    return `[${this.request ? this.request.headers['x-transaction-id'] : ''}] `;
  }

  error(message: any, trace = '', context?: string) {
    const instance = this.getInstance();
    instance &&
      instance.error.call(
        instance,
        `${this.prefixLogger()}${message}`,
        trace,
        context || this.context,
      );
  }

  log(message: any, context?: string) {
    this.callFunction('log', `${this.prefixLogger()}${message}`, context);
  }

  warn(message: any, context?: string) {
    this.callFunction('warn', `${this.prefixLogger()}${message}`, context);
  }

  debug(message: any, context?: string) {
    this.callFunction('debug', `${this.prefixLogger()}${message}`, context);
  }

  verbose(message: any, context?: string) {
    this.callFunction('verbose', `${this.prefixLogger()}${message}`, context);
  }

  logErrorToHeader(url, err) {
    if (!process.env.NODE_ENV?.includes('production')) {
      const errorCountStr =
        this.request.headers['remote-api-error-count'] || '0';
      let errorCount = Number(errorCountStr);
      this.request.headers['remote-api-error-url-' + errorCount] = url;
      if (err.response && err.response.data) {
        this.request.headers['remote-api-error-data-' + errorCount] =
          this.getJsonErrorData(err.response.data);
        this.request.headers['remote-api-error-status-' + errorCount] =
          err.response.status;
      }
      if (err.message) {
        this.request.headers['remote-api-error-message-' + errorCount] =
          err.message;
      }
      errorCount += 1;
      this.request.headers['remote-api-error-count'] = errorCount.toString();
    }
  }

  getJsonErrorData(data) {
    try {
      return JSON.stringify(data);
    } catch (e) {
      return data;
    }
  }

  static log(message: any, context = '') {
    this.printMessage(message, clc.green, context);
  }

  static error(message: any, trace = '', context = '') {
    this.printMessage(message, clc.red, context);
    this.printStackTrace(trace);
  }

  static warn(message: any, context = '') {
    this.printMessage(message, clc.yellow, context);
  }

  static debug(message: any, context = '') {
    this.printMessage(message, clc.magentaBright, context);
  }

  static verbose(message: any, context = '') {
    this.printMessage(message, clc.cyanBright, context);
  }

  private callFunction(
    name: 'log' | 'warn' | 'debug' | 'verbose',
    message: any,
    context?: string,
  ) {
    const instance = this.getInstance();
    const func = instance && (instance as typeof BffLoggerService)[name];
    func &&
      func.call(
        instance,
        message,
        context || this.context,
        this.isTimestampEnabled,
      );
  }

  private getInstance(): typeof BffLoggerService | LoggerService {
    const { instance } = BffLoggerService;
    return instance === this ? BffLoggerService : instance;
  }

  private static printMessage(
    message: any,
    color: (message: string) => string,
    context = '',
  ) {
    const output = isObject(message)
      ? `Object:\n${JSON.stringify(message, null, 2)}\n`
      : message;

    const timestamp = moment()
      .utcOffset(480)
      .format('YYYY-MM-DD HH:mm:ss:SSSZ');
    const msg = `[App-Bff] ${
      process.env.isCFDC ? '' : timestamp
    } [${context}] ${output}`;
    logger.info(msg);
  }

  private static printStackTrace(trace: string) {
    if (!trace) {
      return;
    }
    logger.info(trace);
  }
}
