import { Injectable } from '@angular/core';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {


    private _decodedAccessToken: any;
    private _decodedIDToken: any;
    get decodedAccessToken() { return this._decodedAccessToken; }
    get decodedIDToken() { return this._decodedIDToken; }

    constructor(private oauthService: OAuthService, private authConfig: AuthConfig) { }

    initiateAuthentication(): Promise<any> {
        return new Promise((resolveFn, rejectFn) => {
            this.oauthService.configure(this.authConfig);
            this.oauthService.setStorage(localStorage);
            this.oauthService.tokenValidationHandler = new NullValidationHandler();
            this.oauthService.events.pipe(filter((e: any) => {
                return e.type === 'token_received';
            })).subscribe(() => this.handleNewToken())
            this.oauthService.loadDiscoveryDocumentAndLogin().then(isLoggedIn => {
                if (isLoggedIn) {
                    alert(isLoggedIn ? 'authenticated' : 'not authenticated');
                    this.oauthService.setupAutomaticSilentRefresh();
                    resolveFn();
                } else {
                    alert('failed to initialize');
                    this.oauthService.initImplicitFlow();
                    rejectFn();
                }
            });
        })
    }

    private handleNewToken() {
        this._decodedAccessToken = this.oauthService.getAccessToken();
        this._decodedIDToken = this.oauthService.getIdToken();
    }

}