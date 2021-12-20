import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration, VersionInformation } from '../api/models';
import { ConfigurationService } from '../api/services';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config?: Configuration = null;

  constructor(private configurationService: ConfigurationService) {}

  public async load(): Promise<Configuration> {
    if (this.config !== null) {
      return this.config;
    }

    return this.configurationService
      .configurationGetConfiguration()
      .pipe(
        tap((c) => {
          this.config = { ...c };
        })
      )
      .toPromise();
  }

  public async getAuthConfig(): Promise<AuthConfig> {
    return await this.load().then((c) => ({
      issuer: c.oidc.issuer,
      clientId: c.oidc.clientId,
      redirectUri: window.location.origin + '/',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      showDebugInformation: !environment.production,
      postLogoutRedirectUri: c.oidc.postLogoutRedirectUrl,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      customQueryParams: { kc_idp_hint: 'bceid' }
    }));
  }

  public isConfigured(): boolean {
    return this.config === null;
  }

  /**
   * Gets the current versions manage on the BackEnd
   *
   * @returns an array with details of services and its current versions
   **/
  public getVersionInfo(): Observable<Array<VersionInformation>> {
    return this.configurationService.configurationGetApplicationVersionInfo();
  }
}
