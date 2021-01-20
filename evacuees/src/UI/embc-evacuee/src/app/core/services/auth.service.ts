import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }


  private token: string = null;


  public async isAuthenticated(): Promise<boolean> {
    return (await this.getToken()) !== null;
  }

  public Login(returnPath: string): void {
    console.log('login', returnPath);
    window.location.replace('/login?returnUrl=' + returnPath);
  }

  public async getToken(): Promise<string> {
    if (this.token === null) {
      await this.http
        .get('/login/token', { responseType: 'text' })
        .toPromise()
        .then((token) => {
          console.log('token=', token);
          this.token = token;
        })
        .catch((err) => {
          console.error(err);
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.token = null;
          } else {
            console.error('getToken', err);
          }
        });
    }
    console.log(this.token);
    return this.token;
  }
}
