import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthResourceServerErrorHandler, OAuthService } from 'angular-oauth2-oidc';
import { Observable, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private oauthService: OAuthService,
    private authConfig: AuthConfig,
    private userService: UserService,
    private router: Router) { }

  public ensureLoggedIn(): Promise<void> {

    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    // this.oauthService.tokenValidationHandler = new NullValidationHandler();
    return this.oauthService.loadDiscoveryDocumentAndLogin().then(isLoggedIn => {
      console.log('isLoggedIn', isLoggedIn);
      if (isLoggedIn) {
        return this.userService.loadUserProfile().toPromise().then(userProfile => {
          const nextRoute = userProfile.requiredToSignAgreement ? 'electronic-agreement' : (this.oauthService.state || 'responder-access');
          this.router.navigateByUrl(nextRoute).then(_ => Promise.resolve());
        });
      } else {
        return Promise.reject('Not logged in');
      }
    });
  }

  public login(targetUrl: null | string): void {
    this.oauthService.initLoginFlow(targetUrl);
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  public getToken(): string {
    return this.oauthService.getAccessToken();
  }

}

export class OAuthNoopResourceServerErrorHandler implements OAuthResourceServerErrorHandler {

  handleError(err: HttpResponse<any>): Observable<any> {
    return throwError(err);
  }

}
