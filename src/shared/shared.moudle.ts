import { Global, HttpModule, Module } from '@nestjs/common';
import { BffHttpService } from './bff-service/BffHttpService';
import { LitteCatsService } from './service/litte-cats/litte-cats.service';
import { BffLoggerService } from './bff-logger/BffLoggerService';
import _ from 'lodash';
import { v4 } from 'uuid';
import { getCurl } from '../common/utils';
const services = [BffHttpService, LitteCatsService];
/**
 * 1.教训：如果我们运行的时候路由出不来，表示代码中有问题，可能是依赖问题，也可能是其他代码问题，需要查找，netsjs没报错并不代表没错
 * 2.如果在模块中需要使用httpService，那么import的时候就需要导入 HttpModule，否则虽然代码不会报错，但是路由仍然是出不来
 * */
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 4000,
      maxRedirects: 5,
    }),
  ],
  providers: [...services],
  exports: [...services],
})
export class SharedMoudle {
  // constructor(private httpService: HttpService) {
  //   const axios = httpService.axiosRef;
  //   axios.interceptors.request.use(function (config: any) {
  //     const normalHeaders = Object.keys(config.headers).reduce(function (r, e) {
  //       if (typeof config.headers[e] === 'object') {
  //         return r;
  //       } else {
  //         r[e] = config.headers[e];
  //       }
  //       return r;
  //     }, {});
  //     const finalHeaders = {
  //       ...config.headers[config.method],
  //       ...config.headers['common'],
  //       ...normalHeaders,
  //     };
  //     const traceId = v4();
  //     config['metadata'] = {
  //       ...config['metadata'],
  //       startDate: new Date(),
  //       traceId,
  //     };
  //     const prefix = `[${finalHeaders['x-transaction-id'] ?? ''}] ${_.toUpper(
  //       config.method,
  //     )} ${config.url}`;
  //     const headers = `headers: ${JSON.stringify(finalHeaders)}`;
  //     const body = config.data ? `body: ${JSON.stringify(config.data)} ` : '';
  //     const params = config.params
  //       ? `params: ${JSON.stringify(config.params)} `
  //       : '';
  //     const curl = process.env.NODE_ENV?.includes('production')
  //       ? ''
  //       : `curl: ${getCurl(config, finalHeaders, true)}`;
  //     const logContent = `traceId: ${traceId} ${body}${params}${headers} ${curl}`;
  //     BffLoggerService.log(`${prefix} ${logContent}`, 'UPSTREAM-REQUEST');
  //     return config;
  //   });
  //   axios.interceptors.response.use(
  //     (response) => {
  //       const { config } = response;
  //       config['metadata'] = { ...config['metadata'], endDate: new Date() };
  //
  //       const duration =
  //         config['metadata'].endDate.getTime() -
  //         config['metadata'].startDate.getTime();
  //       const prefix = `[${
  //         config.headers['x-transaction-id'] ?? ''
  //       }] ${_.toUpper(config.method)} ${config.url}`;
  //       const headers = `headers: ${JSON.stringify(response.headers)}`;
  //       const body = response.data
  //         ? `body: ${JSON.stringify(response.data)} `
  //         : '';
  //       const params = config.params
  //         ? ` params: ${JSON.stringify(response.data)}`
  //         : '';
  //       const logContent = `statusCode: ${response.status} duration: ${duration}ms traceId: ${config['metadata'].traceId} ${body}${headers}${params}`;
  //
  //       BffLoggerService.log(`${prefix} ${logContent}`, 'UPSTREAM-RESPONSE');
  //       return response;
  //     },
  //     (err) => {
  //       const config = err.config;
  //       const duration = err?.config['metadata']?.startDate
  //         ? `duration: ${
  //             new Date().getTime() - config['metadata'].startDate.getTime()
  //           }ms `
  //         : null;
  //       const prefix = `[${
  //         err?.config?.headers['x-transaction-id'] ?? ''
  //       }] ${_.toUpper(err?.config?.method ?? '')} ${err?.config?.url}`;
  //       const traceId = err?.config['metadata']?.traceId
  //         ? `traceId: ${err.config['metadata'].traceId} `
  //         : '';
  //       const headers = err?.response?.headers
  //         ? `headers: ${JSON.stringify(err.response.headers)} `
  //         : '';
  //       const status = err?.response?.status
  //         ? `status: ${err.response.status} `
  //         : '';
  //       const data = err?.response?.data
  //         ? `data: ${JSON.stringify(err.response.data)} `
  //         : '';
  //       const stack = `stack: ${JSON.stringify(err.stack)} `;
  //       const name = err.name ? `name: "${err.name}" ` : '';
  //       const message = err.message ? `message: "${err.message}" ` : '';
  //       const code = err.code ? `code: ${err.code} ` : '';
  //
  //       const logContent = `${status}${duration}${traceId}${data}${name}${code}${message}${headers}${stack}`;
  //
  //       BffLoggerService.error(`${prefix} ${logContent}`, '', 'UPSTREAM-ERROR');
  //       return Promise.reject(err);
  //     },
  //   );
  //   console.log('Inject interceptors to Http Service');
  // }
}
