import { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  HttpException,
  HttpService,
  Inject,
  Injectable,
  Request,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import _ from 'lodash';
import { flow, merge, omit } from 'lodash/fp';

@Injectable({ scope: Scope.REQUEST })
export class BffHttpService {
  constructor(
    public readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  HTTP_DATA_HANDLER = (res: AxiosResponse) => {
    return res.data;
  };

  DEFAULT_HTTP_ERROR_HANDLER = (err) => {
    if (err.response) {
      throw new HttpException(err.response.data, err.response.status);
    }
    throw err;
  };

  HTTP_ERROR_HANDLER = (err, upstreamName) => {
    if (err.response) {
      if (upstreamName !== null && err.response.data instanceof Object) {
        err.response.data.from = upstreamName;
      }
      throw new HttpException(err.response.data ?? '', err.response.status);
    }

    if (upstreamName !== null) {
      err.from = upstreamName;
    }

    throw err;
  };

  getDefaultHeaders(headers = {}) {
    /*

    "x-transaction-id", "x-starbucks-id","x-customer-id","x-phone-type" for common
    "x-session-type" for msr
    "x-minipromotion-version" for mini promotion
    "x-user-id","x-app-version","x-forwarded-for","x-channel","lang" for asset exchange and provision

    NOTICE: Please only send the header u need as headers, avoid to use big header e.g. request.headers
    */
    // const originalKeepHeaders = _.pick(this.request.headers, [
    //   'x-transaction-id',
    //   'x-starbucks-id',
    //   'x-customer-id',
    //   'x-session-type',
    //   'x-user-id',
    //   'x-app-version',
    //   'x-phone-type',
    //   'x-forwarded-for',
    //   'x-channel',
    //   'x-store-api-version',
    //   'lang',
    //   'ad-code',
    // ]);
    // return _.merge(originalKeepHeaders, headers);
    return headers;
  }

  getMergeRequestHeaders(headers = {}, ignoreHeaders = []) {
    const originalHeaders = this.request.headers;
    return flow(
      merge(originalHeaders),
      omit('host'),
      omit('content-type'),
      omit('content-length'),
      omit(ignoreHeaders),
    )(headers);
  }

  get<Res>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<Res> {
    return this.getWithHeaders(
      url,
      config,
      this.getDefaultHeaders(config.headers),
      upstreamName,
    );
  }

  getWithHeaders<Res>(
    url,
    config: AxiosRequestConfig = {},
    headers = {},
    upstreamName = null,
  ): Observable<Res> {
    config.headers = headers;
    return this.httpService.get(url, config).pipe(
      map(this.HTTP_DATA_HANDLER),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }

  getResWithHeader<T = any>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<AxiosResponse<T>> {
    config.headers = this.getDefaultHeaders(config.headers);
    return this.httpService.get(url, config).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }

  post<Res>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<Res> {
    config.headers = this.getDefaultHeaders(config.headers);
    return this.postWithHeaders(
      url,
      config,
      this.getDefaultHeaders(config.headers),
      upstreamName,
    );
  }

  private postWithHeaders<Res>(
    url,
    config: AxiosRequestConfig = {},
    headers = {},
    upstreamName = null,
  ): Observable<Res> {
    config.headers = headers;
    return this.httpService.post(url, config.data, config).pipe(
      map(this.HTTP_DATA_HANDLER),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }

  postResWithHeader<T = any>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<AxiosResponse<T>> {
    config.headers = this.getDefaultHeaders(config.headers);
    return this.httpService.post(url, config.data, config).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }

  put<Res>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<Res> {
    return this.putWithHeaders(
      url,
      config,
      this.getDefaultHeaders(config.headers),
      upstreamName,
    );
  }

  putWithHeaders<Res>(
    url,
    config: AxiosRequestConfig = {},
    headers = {},
    upstreamName = null,
  ): Observable<Res> {
    config.headers = headers;
    return this.httpService.put(url, config.data, config).pipe(
      map(this.HTTP_DATA_HANDLER),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }

  patch<Res>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<Res> {
    return this.patchWithHeaders(
      url,
      config,
      this.getDefaultHeaders(config.headers),
      upstreamName,
    );
  }

  patchWithHeaders<Res>(
    url,
    config: AxiosRequestConfig = {},
    headers = {},
    upstreamName = null,
  ): Observable<Res> {
    config.headers = headers;
    return this.httpService.patch(url, config.data, config).pipe(
      map(this.HTTP_DATA_HANDLER),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }

  patchResWithHeader<T = any>(
    url,
    config: AxiosRequestConfig = {},
    upstreamName = null,
  ): Observable<AxiosResponse<T>> {
    config.headers = this.getDefaultHeaders(config.headers);
    return this.httpService.patch(url, config.data, config).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => this.HTTP_ERROR_HANDLER(err, upstreamName)),
    );
  }
}
