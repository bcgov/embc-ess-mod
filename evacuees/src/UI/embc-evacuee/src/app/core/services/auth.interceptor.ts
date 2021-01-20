import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { of, Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url);
    if (!req.url.startsWith('/api')) {
      return next.handle(req);
    }
    const getToken = from(this.authService.getToken());
    return getToken.pipe(switchMap(token => {
      if (token === null) {
        return next.handle(req);
      }
      const authToken = 'Bearer ' + token;
      console.log('AuthInterceptor token', authToken);
      const authReq = req.clone({ setHeaders: { Authorization: authToken } });
      return next.handle(authReq);
    }));
  }
}
