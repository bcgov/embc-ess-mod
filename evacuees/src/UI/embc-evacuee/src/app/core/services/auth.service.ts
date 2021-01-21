import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  private get token(): string { return window.sessionStorage.getItem('auth:token'); }
  private set token(v: string) {
    if (v) {
      window.sessionStorage.setItem('auth:token', v);
    } else {
      window.sessionStorage.removeItem('auth:token');
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    return (await this.getToken()) != null;
  }

  public login(returnPath: string): void {
    console.log('login', returnPath);
    this.token = null;
    window.location.replace('/login?returnUrl=' + returnPath);
  }

  public async getToken(): Promise<string> {
    if (!this.token) {
      this.token = await this.http
        .get('/login/token', { responseType: 'text' })
        .pipe(switchMap(token => {
          return of(token);
        }), catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return of(null);
          }
          console.error('getToken', error);
          return throwError(error);
        })).toPromise();
    }
    return this.token;
  }
}
