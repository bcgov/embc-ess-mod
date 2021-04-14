import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SupplierHttpService } from './supplierHttp.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private config?: Configuration = null;

    constructor(private supplierHttp: SupplierHttpService,) { }

    public load(): Observable<Configuration> {
        if (this.config != null) {
            return of(this.config);
        }
        return this.supplierHttp.getAuthConfig().pipe(tap((c: any) => {
            this.config = { ...c };
        }));
    }

    public async getAuthConfig(): Promise<AuthConfig> {
        return await this.load().pipe(map(c => (
            {
                issuer: c.oidc.issuer,
                clientId: c.oidc.clientId,
                redirectUri: window.location.origin + '/auth',
                responseType: 'code',
                scope: 'openid profile email offline_access',
                showDebugInformation: !environment.production,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                customQueryParams: { kc_idp_hint: 'bceid' },
            }))).toPromise();
    }

    public isConfigured(): boolean {
        return this.config === null;
    }
}

export interface OidcConfiguration {
    clientId?: null | string;
    issuer?: null | string;
}

export interface Configuration {
    oidc?: null | OidcConfiguration;
}
