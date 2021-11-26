import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration, VersionInformation } from '../api/models';
import { ConfigurationService } from '../api/services';
import { EnvironmentInformation } from '../models/environment-information.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configurationGetEnvironmentInfoPath = '/env/info.json';
  private config?: Configuration = null;

  constructor(
    private configurationService: ConfigurationService,
    private http: HttpClient
  ) {}

  public load(): Observable<Configuration> {
    if (this.config != null) {
      return of(this.config);
    }
    return this.configurationService.configurationGetConfiguration().pipe(
      tap((c) => {
        this.config = { ...c };
      })
    );
  }

  public async getAuthConfig(): Promise<AuthConfig> {
    return await this.load()
      .pipe(
        map((c) => ({
          issuer: c.oidc.issuer,
          clientId: c.oidc.clientId,
          redirectUri: window.location.origin + '/',
          responseType: 'code',
          scope: 'openid profile email offline_access',
          showDebugInformation: !environment.production,
          postLogoutRedirectUri: c.oidc.postLogoutRedirectUrl,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          customQueryParams: { kc_idp_hint: 'bceid' }
        }))
      )
      .toPromise();
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

  public getEnvironmentInfo(): Observable<EnvironmentInformation> {
    const envUrl = this.configurationGetEnvironmentInfoPath;

    return this.http.get(envUrl);
  }
}
