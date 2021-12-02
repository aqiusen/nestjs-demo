import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class Response {
  static success(code: number, data: unknown) {
    return {
      code: code,
      data: data,
    };
  }

  static successWithMessage(code: number, data: unknown, message: string) {
    return {
      code: code,
      data: data,
      message: message,
    };
  }

  static fail(code: number, error: unknown, message: string) {
    return {
      code: code,
      error: error,
      message: message,
    };
  }

  static transResToExtractData(
    data: Observable<any>,
    transData = true,
  ): Observable<any> {
    return data.pipe(
      map((res) => {
        if (transData && res?.data?.data) {
          return this.success(res.status, res.data.data);
        }
        return this.success(res.status, res.data);
      }),
      this.handleError(),
    );
  }

  static transRes(data: Observable<any>): Observable<any> {
    return data.pipe(
      map((res) => {
        return this.success(res.status, res.data);
      }),
      this.handleError(),
    );
  }

  static handleError() {
    return catchError((err) => {
      if (err.getResponse?.()) {
        const errData = err.getResponse().error ?? err.getResponse();
        return of(this.fail(err.getStatus(), errData, ''));
      }

      if (err?.response) {
        return of(this.fail(err.response.status, err.response.data, ''));
      }

      return of(this.fail(500, { message: err.message }, ''));
    });
  }
}
