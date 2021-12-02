import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../common/constant';

export class TransformResponseExtractDataInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        console.log('next -----', data);
        return Response.success(data.status, data.data.data ?? data.data);
      }),
    );
  }
}
