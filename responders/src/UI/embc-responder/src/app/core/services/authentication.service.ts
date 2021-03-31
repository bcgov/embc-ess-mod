import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthResourceServerErrorHandler, OAuthService } from 'angular-oauth2-oidc';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService,
    private userService: UserService,
    private router: Router) { }

  public async login(): Promise<void> {
    await this.configureOAuthService();
    const returnRoute = location.pathname.substring(1);
    const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({ state: returnRoute });
    if (isLoggedIn) {
      const userProfile = await this.userService.loadUserProfile();
      const nextRoute = decodeURIComponent(userProfile.requiredToSignAgreement
        ? 'electronic-agreement' :
        (this.oauthService.state || returnRoute || 'responder-access'));
      await this.router.navigate([nextRoute]);
      return Promise.resolve();
    } else {
      return Promise.reject('Not logged in');
    }
  }

  public logout(targetUrl?: string): void {
    this.oauthService.revokeTokenAndLogout();
    if (targetUrl != null) { window.location.replace(targetUrl); }
  }

  public getToken(): string {
    return this.oauthService.getAccessToken();
  }

  private async configureOAuthService(): Promise<void> {
    return this.configService.getAuthConfig().then(authConfig => {
      // this.oauthService.tokenValidationHandler = new NullValidationHandler();
      this.oauthService.configure(authConfig);
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }

}

