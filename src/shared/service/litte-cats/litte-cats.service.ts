import { Injectable, Scope } from '@nestjs/common';
import { BffHttpService } from '../../bff-service/BffHttpService';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class LitteCatsService extends BffHttpService {
  getLitterCats(): Observable<any> {
    // return this.httpService.get('http://localhost:8888/list');
    //当不写拦截器的时候这个是正确的，但是当开启拦截器的时候这个是错误的
    // const response1 = this.httpService.get('http://localhost:8888/list').pipe(
    //   map((data) => {
    //     console.log('22222222', data.data);
    //     return data; //这里要把原来的data返回去,否则拦截器解析出错之后会报500
    //   }),
    //   catchError((error) => of({ data: {} })),
    // );
    // console.log(response1);
    // return response1;
    //如果没有拦截器，会报500的错误，这个是否是调用了之后一定要用拦截器，能否不用拦截器实现
    return this.getResWithHeader('http://localhost:8888/list', {}, 'List');
  }
}
