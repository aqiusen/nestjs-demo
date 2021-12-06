import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../common/constant';

export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('global  -----before');
    return next.handle().pipe(
      map((data) => {
        console.log('global  -----', data);
        const result = Response.success(data.status, data.data ?? data);
        return result;
      }),
    );
  }
}
