import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // simple url whitelist that do not require authentication header
  private whiteListUrls = [
    '/login*',
    '/token',
    '/api/location*',
    '/api/registration*',
    '/captcha'
  ];

  constructor(private authService: AuthService, private router: Router) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // only set authentication header for API requests
    const whiteListed = this.isWhiteListed(req.url);
    console.log(req.url, ' whitelisted ', whiteListed);
    if (whiteListed) {
      return next.handle(req);
    }
    return this.authService.getToken()
      .pipe(switchMap(token => {
        if (!token) {
          // no token, do not add authentication header
          return next.handle(req);
        } else {
          // set authentication header
          const authToken = `Bearer ${token}`;
          const authReq = req.clone({ setHeaders: { Authorization: authToken } });
          return next.handle(authReq);
        }
      }), catchError(error => {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else if (error.status === 401) {
          // Access denied, force login
          console.warn('API returned 401 access denied, redirecting to login', error.url);
          this.authService.login(this.router.url);
          return EMPTY;
        }
        else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(`API ${req.url} returned code ${error.status}, body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
      }));
  }

  private isWhiteListed(url: string): boolean {
    return this.whiteListUrls.some(u => {
      if (u.endsWith('*')) { return url.startsWith(u.slice(0, u.length - 1)); }
      return u === url;
    });
  }
}
