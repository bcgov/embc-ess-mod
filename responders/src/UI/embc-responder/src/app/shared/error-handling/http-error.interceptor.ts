import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { catchError, delay, mergeMap, retryWhen } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      this.delayedRetry(2000, 2, request.url),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => this.errorHandler(error));
      })
    ) as Observable<HttpEvent<any>>;
  }

  private delayedRetry(
    delayMs: number,
    maxRetry: number,
    requestUrl: string
  ): (src: Observable<any>) => Observable<any> {
    let retries = maxRetry;
    return (src: Observable<any>) =>
      src.pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(delayMs),
            mergeMap((error) => {
              if (
                error.status !== 403 &&
                error.status !== 404 &&
                error.status !== 408
              ) {
                return retries-- > 0
                  ? of(error)
                  : throwError(() => this.errorHandler(error));
              }
              return throwError(() => this.errorHandler(error));
            })
          )
        )
      );
  }

  private errorHandler(error: HttpErrorResponse): HttpErrorResponse {
    return new HttpErrorResponse({
      error: error.message,
      headers: error.headers,
      status: error.status,
      statusText: error.statusText,
      url: error.url
    });
  }
}
