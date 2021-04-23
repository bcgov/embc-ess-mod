import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(
        private oauthService: OAuthService,
        private configService: ConfigService
    ) { }

    public init(): Promise<void> {
        return this.configureOAuthService();
    }

    public async login(): Promise<string> {
        await this.configureOAuthService();
        const returnRoute = location.pathname.substring(1);
        const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({ state: returnRoute });
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

        return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
            return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
        });
    }

    private async configureOAuthService(): Promise<void> {
        return this.configService.getAuthConfig().then(config => {
            let authConfig = {
                issuer: config.issuer,
                clientid: config.clientId
            }
            console.log("setting auth config");
            console.log(config);
            // this.oauthService.tokenValidationHandler = new NullValidationHandler();
            this.oauthService.configure(config);
            this.oauthService.setupAutomaticSilentRefresh();
        });
    }
}