import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private isConfigSet = false;
  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService
  ) {}

  public init(): Promise<void> {
    return this.configureOAuthService();
  }

  public async login(): Promise<string> {
    await this.configureOAuthService();
    const returnRoute = location.pathname.substring(1);
    const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
      state: returnRoute
    });
    if (isLoggedIn) {
      return Promise.resolve(this.oauthService.state || returnRoute);
    } else {
      return Promise.reject('Not logged in');
    }
  }

  public logout(targetUrl?: string): void {
    this.oauthService.logOut();
  }

  public getToken(): string {
    return this.oauthService.getAccessToken();
  }

  public hasValidToken(): Promise<boolean> {
    if (this.oauthService.hasValidIdToken()) {
      return Promise.resolve(true);
    }

    if (!this.isConfigSet) {
      return this.configureOAuthService().then(() => {
        return this.oauthService
          .loadDiscoveryDocumentAndTryLogin()
          .then((_) => {
            return (
              this.oauthService.hasValidIdToken() &&
              this.oauthService.hasValidAccessToken()
            );
          });
      });
    } else {
      return this.oauthService.loadDiscoveryDocumentAndTryLogin().then((_) => {
        return (
          this.oauthService.hasValidIdToken() &&
          this.oauthService.hasValidAccessToken()
        );
      });
    }
  }

  private async configureOAuthService(): Promise<void> {
    return this.configService.getAuthConfig().then((config) => {
      this.oauthService.configure(config);
      this.oauthService.setupAutomaticSilentRefresh();
      this.isConfigSet = true;
    });
  }
}
