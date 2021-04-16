import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private oauthService: OAuthService, private router: Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.oauthService.hasValidIdToken()) {
            return Promise.resolve(true);
        }

        return this.oauthService.loadDiscoveryDocumentAndTryLogin()
            .then(_ => {
                return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
            })
            .then(valid => {
                if (!valid) {
                    this.router.navigate(['/public']);
                }
                return valid;
            });
    }
}