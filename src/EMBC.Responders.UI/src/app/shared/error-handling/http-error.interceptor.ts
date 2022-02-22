import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, Observable, of } from 'rxjs';
import { catchError, delay, mergeMap, retryWhen } from 'rxjs/operators';
import { AlertService } from '../components/alert/alert.service';
import { ErrorDialogService } from './error-dialog/error-dialog.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorDialogService: ErrorDialogService,
    private router: Router,
    private alertService: AlertService
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      this.delayedRetry(2000, 2),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => this.errorHandler(error));
      })
    ) as Observable<HttpEvent<any>>;
  }

  private delayedRetry(
    delayMs: number,
    maxRetry: number
  ): (src: Observable<any>) => Observable<any> {
    let retries = maxRetry;
    return (src: Observable<any>) =>
      src.pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(delayMs),
            mergeMap((error) =>
              retries-- > 0
                ? of(error)
                : throwError(() => this.errorHandler(error))
            )
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
