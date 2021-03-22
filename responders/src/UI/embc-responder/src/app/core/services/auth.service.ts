import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthResourceServerErrorHandler, OAuthService } from 'angular-oauth2-oidc';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService,
    private userService: UserService,
    private router: Router) { }

  public async ensureLoggedIn(): Promise<void> {
    await this.configureOAuthService();
    const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin();
    if (isLoggedIn) {
      const userProfile = await this.userService.loadUserProfile().toPromise();
      const nextRoute = userProfile.requiredToSignAgreement
        ? 'electronic-agreement' :
        (this.oauthService.state || 'responder-access');
      await this.router.navigateByUrl(nextRoute);
      return Promise.resolve();
    } else {
      return Promise.reject('Not logged in');
    }


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

  private configureOAuthService(): Promise<void> {
    return this.configService.getAuthConfig().pipe(map(authConfig => {
      // this.oauthService.tokenValidationHandler = new NullValidationHandler();
      this.oauthService.configure(authConfig);
      this.oauthService.setupAutomaticSilentRefresh();
    })).toPromise();
  }

}

export class OAuthNoopResourceServerErrorHandler implements OAuthResourceServerErrorHandler {

  handleError(err: HttpResponse<any>): Observable<any> {
    return throwError(err);
  }

}
