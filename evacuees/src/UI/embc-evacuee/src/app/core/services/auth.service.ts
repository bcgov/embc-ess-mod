import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { catchError, concatMap, delay, map, retry, retryWhen, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginService } from '../api/services';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private refreshTokenSub: Subscription;
  private refreshInterval: number = environment.tokenRefreshPeriodInSeconds * 1000;
  private httpRetryNumber: number = environment.httpRetryNumber;
  private httpRetryDelay: number = environment.httpRetryDelayInSeconds * 1000;

  constructor(private loginService: LoginService, private router: Router) {
    this.registerRefreshTokenInterval();
  }

  private get token(): string { return window.sessionStorage.getItem('auth:token'); }
  private set token(v: string) {
    if (v != null) {
      window.sessionStorage.setItem('auth:token', v);
    } else {
      window.sessionStorage.removeItem('auth:token');
    }
  }

  public isAuthenticated(): boolean {
    return this.token != null;
  }

  public login(returnPath: string): void {
    console.log('login', returnPath);
    this.token = null;
    let loginUrl = '/login?returnUrl=' + returnPath;
    const loginAsPropertyName = 'loginAs';
    if (!environment.production && environment.hasOwnProperty(loginAsPropertyName)) {
      // impersonate a user for automated testing and local development experience
      loginUrl = loginUrl + '&loginAs=' + environment[loginAsPropertyName];
    }
    window.location.replace(loginUrl);
  }

  public logout(url: string): void {
    console.log('logout', url);
    this.token = null;
    window.location.replace(url);
  }

  public getToken(): Observable<string> {
    // console.debug('getToken');
    return this.token
      ? of(this.token)
      : this.loginService.loginToken()
        .pipe(switchMap(token => {
          this.token = token;
          return of(this.token);
        }), catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.token = null;
            return of(this.token);
          }
          return throwError(error);
        }));
  }

  public registerRefreshTokenInterval(): void {
    console.log('registerRefreshTokenInterval');
    this.refreshTokenSub = timer(0, this.refreshInterval)
      .pipe(
        switchMap(_ => this.token != null
            ? this.refreshToken().pipe(tap(res => {
              if (!res) { this.logout(this.router.url); }
              return EMPTY;
            }))
            : EMPTY),
        catchError(error => {
          console.error('registerRefreshTokenInterval', error);
          return EMPTY;
        })).subscribe();
  }

  public refreshToken(): Observable<boolean> {
    return this.loginService.loginRefreshToken()
      .pipe(
        switchMap(token => {
          // update token
          this.token = token;
          return of(true);
        }),
        retryWhen(errors => errors.pipe(delay(this.httpRetryDelay), take(this.httpRetryNumber))),
        catchError(error => {
          console.error(error);
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // token expired or not valid
            return of(false);
          }
          console.error('refreshToken', error);
          return throwError(error);
        }));
  }

}
