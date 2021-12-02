import { Controller, Get, HttpService } from '@nestjs/common';
import { catchError, flatMap, map } from 'rxjs/operators';
import { AppService } from './app.service';
import { forkJoin, of, throwError } from 'rxjs';
import MyLoggerService from './log/MyLogger.service';
const httpService = new HttpService();

@Controller('/app/auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logger: MyLoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('1111');
    const request1 = httpService.get('http://localhost:8888/data.json').pipe(
      map((data) => {
        return data.data;
      }),
    );
    const request2 = httpService.get('http://localhost:8888/data1.json').pipe(
      map((data) => {
        return data.data;
      }),
    );
    // forkJoin([request1, request2])
    //   .pipe(
    //     map((result) => {
    //       // console.log('result=', result);
    //       return {
    //         ...result[0],
    //         ...result[1],
    //       };
    //     }),
    //   )
    //   .subscribe((res) => console.log(res));

    // 如果是pipe中的map返回值是of，最后返回的是一个Observable对象，console打印不出来真正的值
    // flatMap 可以将第一个接口的返回值获取(参数的值就是第一个请求的返回值)，然后调用第二个接口
    request1
      .pipe(
        flatMap((result1) => {
          console.log('result1 = ', result1);
          return request2.pipe(
            map((result) => {
              return result;
            }),
          );
        }),
      )
      .subscribe((res) => console.log('res=', res));

    of({ age: 11 })
      .pipe(
        map((value) => {
          throw new Error('出错了');
        }),
        catchError((error) => {
          console.log('error=====', error);
          return of({ age: 100 });
        }),
      )
      .subscribe((res) => {
        console.log(res);
      });

    return this.appService.getHello();
  }
}
