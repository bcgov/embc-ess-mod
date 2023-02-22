import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { lastValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration, OutageInformation } from '../api/models';
import { ConfigurationService } from '../api/services';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config?: Configuration = null;

  constructor(private configurationService: ConfigurationService) {}

  public async load(): Promise<Configuration> {
    if (this.config !== null) {
      return this.config;
    }

    const config$ = this.configurationService
      .configurationGetConfiguration()
      .pipe(
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      customQueryParams: { kc_idp_hint: 'bceidboth' }
    }));
  }

  public isConfigured(): boolean {
    return this.config === null;
  }

  public getOutageConfig(): Observable<OutageInformation> {
    return this.configurationService.configurationGetOutageInfo();
  }
}
