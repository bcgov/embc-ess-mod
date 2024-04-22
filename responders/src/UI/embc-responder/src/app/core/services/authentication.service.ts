import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService
  ) {}

  public async login(): Promise<string> {
    await this.configureOAuthService();
    const returnRoute = location.pathname.substring(1);
    const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
      state: returnRoute
    });
    if (isLoggedIn) {
      return Promise.resolve(this.oauthService.state || returnRoute);
    }
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  public getToken(): string {
    return this.oauthService.getAccessToken();
  }

  private async configureOAuthService(): Promise<void> {
    return this.configService.getAuthConfig().then((authConfig) => {
      this.oauthService.configure(authConfig);
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }
}
