import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { lastValueFrom, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration, OutageInformation } from '../api/models';
import { ConfigurationService } from '../api/services';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config?: Configuration = null;

  private accessReasons: Array<[string, string]>;

  constructor(private configurationService: ConfigurationService) {}

  public async load(): Promise<Configuration> {
    if (this.config !== null) {
      return this.config;
    }

    const config$ = this.configurationService.configurationGetConfiguration().pipe(
      tap((c: Configuration) => {
        this.config = { ...c };
      })
    );

    return lastValueFrom(config$);
  }

  public async getAuthConfig(): Promise<AuthConfig> {
    return await this.load().then((c) => ({
      issuer: c.oidc.issuer,
      clientId: c.oidc.clientId,
      redirectUri: window.location.origin + '/',
      responseType: 'code',
      scope: c.oidc.scope,
      showDebugInformation: !environment.production,
      postLogoutRedirectUri: c.oidc.postLogoutRedirectUrl,
      customQueryParams: { kc_idp_hint: 'bceidboth' }
    }));
  }

  public isConfigured(): boolean {
    return this.config === null;
  }

  public getOutageConfig(): Observable<OutageInformation> {
    return this.configurationService.configurationGetOutageInfo();
  }

  getAccessReasons() {
    if (this.accessReasons) return of(this.accessReasons);

    return this.configurationService.configurationGetAuditOptions({}).pipe(
      map((res) => Object.entries(res)),
      tap((res) => (this.accessReasons = res))
    );
  }
}
