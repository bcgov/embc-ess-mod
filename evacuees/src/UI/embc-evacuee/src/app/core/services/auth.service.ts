import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private user: IUser = null;

  public async isAuthenticated(): Promise<boolean> {
    return (await this.GetUser()) !== null;
  }

  public Login(returnPath: string): void {
    console.log('login', returnPath);
    window.location.replace('/login?returnUrl=' + returnPath);
  }

  private async GetUser(): Promise<IUser> {
    if (this.user === null) {
      await this.http
        .get<IUser>('/api/user')
        .toPromise()
        .then((u) => (this.user = u))
        .catch((err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.user = null;
          } else {
            console.error(err);
          }
        });
    }
    console.log(this.user);
    return this.user;
  }
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}
