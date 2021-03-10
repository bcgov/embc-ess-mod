import { Injectable } from '@angular/core';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {


    private decodedAccessToken: any;
    private decodedIDToken: any;
    get accessToken(): any { return this.decodedAccessToken; }
    get iDToken(): any { return this.decodedIDToken; }

    constructor(private oauthService: OAuthService, private authConfig: AuthConfig) { }

    initiateAuthentication(): Promise<any> {
        return new Promise((resolveFn, rejectFn) => {
            this.oauthService.configure(this.authConfig);
            this.oauthService.setStorage(sessionStorage);
            this.oauthService.tokenValidationHandler = new NullValidationHandler();
            this.oauthService.events.pipe(filter((e: any) => {
                return e.type === 'token_received';
            })).subscribe(() => this.handleNewToken());
            this.oauthService.loadDiscoveryDocumentAndLogin().then(isLoggedIn => {
                if (isLoggedIn) {
                    this.oauthService.setupAutomaticSilentRefresh();
                    resolveFn();
                } else {
                    alert('failed to initialize');
                    this.oauthService.initImplicitFlow();
                    rejectFn();
                }
            });
        });
    }

    private handleNewToken(): void {
        this.decodedAccessToken = this.oauthService.getAccessToken();
        this.decodedIDToken = this.oauthService.getIdToken();
    }

    logout(): void {
        this.oauthService.logOut();
    }

}
